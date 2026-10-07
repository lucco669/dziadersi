import assert from "node:assert/strict";
import { test } from "node:test";
import type { SupabaseClient } from "@supabase/supabase-js";
import { authLetter } from "../src/emails/auth";
import { emailRedirectTarget, emailRedirectUrl, passwordResetPath, safeNext, trustedOrigin } from "../src/lib/account";
import { passwordAuth } from "../src/lib/password-auth";

const origin = "https://dziader.si";
const password = "a long unique test password";
function form(values: Record<string, string> = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({ email: " Reader@Example.com ", password, passwordConfirm: password, jezyk: "pl", dalej: "/profil/zapisz/2abc", ...values })) data.set(key, value);
  return data;
}
function fixture(responses: Record<string, unknown>) {
  const calls: { method: string; args: unknown[] }[] = [];
  const auth = new Proxy({}, { get: (_, method: string) => async (...args: unknown[]) => {
    calls.push({ method, args });
    assert.ok(method in responses, `Unexpected auth call: ${method}`);
    const result = responses[method];
    if (result instanceof Error) throw result;
    return result;
  } });
  return { client: { auth } as Pick<SupabaseClient, "auth">, calls };
}

test("auth redirects reject external origins, backslashes and browser-stripped control characters", () => {
  for (const path of [null, ["/profil"], "https://evil.example", "//evil.example", "/\\evil.example", "/\n/evil.example", "/\t/evil.example", "/\r/evil.example", " /profil"]) {
    assert.equal(safeNext(path, "/sl/profil"), "/sl/profil");
  }
  assert.equal(safeNext("/sl/profil/shrani/2abc?x=1#section"), "/sl/profil/shrani/2abc?x=1#section");
});

test("email callbacks and the branded hook preserve locale, query strings and the original destination", () => {
  for (const locale of ["pl", "sl"] as const) {
    const next = locale === "sl" ? "/sl/profil/shrani/2abc?x=1&y=2" : "/profil/zapisz/2abc?x=1&y=2";
    const reset = passwordResetPath(next, locale);
    const callback = new URL(emailRedirectUrl(origin, reset, locale));
    assert.equal(callback.pathname, "/auth/callback");
    assert.equal(callback.searchParams.get("jezyk"), locale);
    assert.equal(callback.searchParams.get("dalej"), reset);
    const target = emailRedirectTarget(trustedOrigin(callback.href)!);
    assert.equal(target.next, reset);
    assert.equal(new URL(target.next, origin).searchParams.get("dalej"), next);
    assert.equal(new URL(target.next, origin).pathname, locale === "sl" ? "/sl/racun" : "/konto");
  }
  assert.equal(emailRedirectTarget({ origin, next: "/auth/callback?flow=email&jezyk=sl&dalej=//evil.example" }).next, "/sl/profil");
});

test("registration validates email, password bounds and confirmation before calling Supabase", async () => {
  const { client, calls } = fixture({});
  const invalidForms: Record<string, string>[] = [{ email: "invalid" }, { password: "short" }, { password: "x".repeat(129) }, { passwordConfirm: "different" }];
  for (const values of invalidForms) {
    const result = await passwordAuth(client, "register", form(values), origin);
    assert.ok(result.error);
    assert.ok(!JSON.stringify(result).includes(password));
  }
  assert.equal(calls.length, 0);
});

test("signup sends the chosen password unchanged, remembers the edition and waits for email verification", async () => {
  const { client, calls } = fixture({ signUp: { data: { session: null, user: {} }, error: null } });
  const result = await passwordAuth(client, "register", form({ jezyk: "sl", dalej: "/sl/profil", password: ` ${password} `, passwordConfirm: ` ${password} ` }), origin);
  assert.ok(result.message && result.confirm);
  assert.equal(result.destination, undefined);
  assert.deepEqual(calls, [{ method: "signUp", args: [{ email: "reader@example.com", password: ` ${password} `, options: { emailRedirectTo: emailRedirectUrl(origin, "/sl/profil", "sl"), data: { jezyk: "sl" } } }] }]);
  assert.ok(!JSON.stringify(result).includes(password));
});

test("signup with an immediate session continues; existing-account responses stay neutral", async () => {
  const active = fixture({ signUp: { data: { session: { access_token: "secret" } }, error: null } });
  assert.deepEqual(await passwordAuth(active.client, "register", form(), origin), { destination: "/profil/zapisz/2abc" });
  const fresh = fixture({ signUp: { data: { session: null }, error: null } });
  const existing = fixture({ signUp: { data: { session: null }, error: { code: "user_already_exists" } } });
  assert.deepEqual(await passwordAuth(existing.client, "register", form(), origin), await passwordAuth(fresh.client, "register", form(), origin));
});

test("password login uses a verified Supabase session and sanitizes its return path", async () => {
  const { client, calls } = fixture({ signInWithPassword: { data: { user: { id: "user", user_metadata: { jezyk: "sl" } } }, error: null } });
  const result = await passwordAuth(client, "login", form({ jezyk: "sl", dalej: "//evil.example" }), origin);
  assert.deepEqual(result, { destination: "/sl/profil" });
  assert.deepEqual(calls, [{ method: "signInWithPassword", args: [{ email: "reader@example.com", password }] }]);
});

test("wrong credentials, unconfirmed accounts, rate limits and service failures are translated without raw details", async () => {
  for (const locale of ["pl", "sl"]) {
    for (const code of ["invalid_credentials", "email_not_confirmed", "over_request_rate_limit", "unexpected_failure"]) {
      const { client } = fixture({ signInWithPassword: { data: {}, error: { code, message: "private provider detail" } } });
      const result = await passwordAuth(client, "login", form({ jezyk: locale }), origin);
      assert.ok(result.error);
      assert.ok(!JSON.stringify(result).includes("private provider detail"));
      assert.equal(result.destination, undefined);
      assert.equal(Boolean(result.confirm), code === "email_not_confirmed");
    }
  }
  const { client } = fixture({ signInWithPassword: new Error("private network detail") });
  assert.ok((await passwordAuth(client, "login", form(), origin)).error);
});

test("recovery sends a callback that reaches the password form and does not assert account existence", async () => {
  const { client, calls } = fixture({ resetPasswordForEmail: { error: null } });
  const result = await passwordAuth(client, "recovery", form({ jezyk: "sl", dalej: "/sl/profil/shrani/2abc" }), origin);
  assert.match(result.message!, /^Če račun/);
  assert.deepEqual(calls, [{ method: "resetPasswordForEmail", args: ["reader@example.com", { redirectTo: emailRedirectUrl(origin, passwordResetPath("/sl/profil/shrani/2abc", "sl"), "sl") }] }]);
});

test("password updates require a verified user even when the form is submitted directly", async () => {
  for (const response of [{ data: { user: null }, error: null }, { data: { user: { id: "stale" } }, error: { code: "bad_jwt" } }]) {
    const { client, calls } = fixture({ getUser: response });
    assert.ok((await passwordAuth(client, "password", form(), origin)).error);
    assert.deepEqual(calls.map(({ method }) => method), ["getUser"]);
  }
});

test("verified password changes and provider password-policy failures propagate correctly", async () => {
  const { client, calls } = fixture({ getUser: { data: { user: { id: "verified" } }, error: null }, updateUser: { error: null } });
  assert.deepEqual(await passwordAuth(client, "password", form(), origin), { destination: "/profil/zapisz/2abc" });
  assert.deepEqual(calls[1], { method: "updateUser", args: [{ password }] });
  for (const code of ["weak_password", "same_password", "reauthentication_needed"]) {
    const failing = fixture({ getUser: { data: { user: { id: "verified" } }, error: null }, updateUser: { error: { code } } });
    const result = await passwordAuth(failing.client, "password", form(), origin);
    assert.ok(result.error);
    assert.equal(result.destination, undefined);
  }
});

test("confirmation can be resent without resubmitting or storing the password", async () => {
  const { client, calls } = fixture({ resend: { error: null } });
  assert.ok((await passwordAuth(client, "resend", form(), origin)).confirm);
  assert.deepEqual(calls, [{ method: "resend", args: [{ type: "signup", email: "reader@example.com", options: { emailRedirectTo: emailRedirectUrl(origin, "/profil/zapisz/2abc", "pl") } }] }]);
});

test("recovery letters lead to the new-password form; magic links keep their one-time code", () => {
  for (const locale of ["pl", "sl"] as const) {
    const recovery = authLetter({ type: "recovery", link: `${origin}/auth/potwierdz?type=recovery`, token: "123456" }, locale)!;
    assert.ok(recovery.button);
    assert.equal(recovery.code, undefined);
    assert.match(recovery.button.label, locale === "pl" ? /hasło/ : /geslo/);
    for (const type of ["signup", "magiclink"]) assert.equal(authLetter({ type, token: "123456" }, locale)?.code?.value, "123456");
    assert.doesNotMatch(authLetter({ type: "password_changed_notification" }, locale)!.paragraphs.join(" "), /zasadniczo|načeloma/);
  }
});
