import type { Letter } from "./layout";

/*
 * Auth emails, written by the Institute's registry. Supabase decides when to send them
 * (the Send Email Hook); these decide what they say.
 */

export type AuthEmail = {
  /** Supabase's email_action_type. */
  type: string;
  /** Where the button leads: our /auth/potwierdz with the token hash. */
  link?: string;
  /** The six-digit one-time code. */
  token?: string;
};

const IGNORE = "Jeśli to nie ty, zignoruj tę wiadomość. Instytut niczego nie zrobi, najwyżej się zdziwi.";

const NOTIFICATIONS: Record<string, { title: string; text: string }> = {
  email_changed_notification: {
    title: "Adres e-mail zmieniony",
    text: "Adres e-mail przypisany do Profilu Dziaderskiego został właśnie zmieniony.",
  },
  password_changed_notification: {
    title: "Hasło zmienione",
    text: "Hasło do Profilu Dziaderskiego zostało zmienione, choć Instytut haseł zasadniczo nie używa.",
  },
  identity_linked_notification: {
    title: "Nowy sposób logowania",
    text: "Do Profilu Dziaderskiego dodano nowy sposób logowania.",
  },
  identity_unlinked_notification: {
    title: "Usunięty sposób logowania",
    text: "Z Profilu Dziaderskiego usunięto jeden ze sposobów logowania.",
  },
};

export function authLetter({ type, link, token }: AuthEmail): Letter | null {
  const code = token ? { label: "Albo przepisz kod w oknie logowania:", value: token } : undefined;

  switch (type) {
    case "magiclink":
    case "email":
      return {
        subject: "Skierowanie do Profilu Dziaderskiego",
        preheader: "Jedno kliknięcie i jesteś w profilu. Hasło nie jest potrzebne.",
        department: "Rejestracja",
        title: "Skierowanie do Profilu Dziaderskiego",
        paragraphs: [
          "Na ten adres zamówiono wejście do Profilu Dziaderskiego. Wystarczy kliknąć przycisk poniżej, hasło nie jest potrzebne.",
          "Skierowanie jest ważne przez godzinę i działa jeden raz, jak karta obiegowa.",
        ],
        button: link ? { href: link, label: "Wchodzę do profilu" } : undefined,
        code,
        note: IGNORE,
      };

    case "signup":
    case "invite":
      return {
        subject: type === "invite" ? "Zaproszenie do Instytutu Badań nad Dziaderstwem" : "Witamy w rejestrze Instytutu",
        preheader: "Potwierdź adres, a Instytut założy Profil Dziaderski.",
        department: "Rejestracja",
        title: type === "invite" ? "Zaproszenie do rejestru" : "Witamy w rejestrze",
        paragraphs: [
          type === "invite"
            ? "Ktoś zgłosił ten adres do rejestru Instytutu. Wystarczy potwierdzić go przyciskiem poniżej, a Profil Dziaderski będzie gotowy."
            : "Instytut przyjął zgłoszenie. Wystarczy potwierdzić adres przyciskiem poniżej, a Profil Dziaderski będzie gotowy.",
          "W profilu zapiszesz wyniki badań, zbierzesz gatunki do kolekcji i dostaniesz odznaki. Hasła nie ma: za każdym razem przyślemy skierowanie.",
        ],
        button: link ? { href: link, label: "Potwierdzam adres" } : undefined,
        code,
        note: IGNORE,
      };

    case "email_change":
      return {
        subject: "Potwierdzenie zmiany adresu",
        preheader: "Profil Dziaderski przenosi się na nowy adres. Potrzebne potwierdzenie.",
        department: "Rejestracja",
        title: "Potwierdzenie zmiany adresu",
        paragraphs: [
          "W Profilu Dziaderskim poproszono o zmianę adresu e-mail. Zmiana wejdzie w życie po potwierdzeniu.",
          "Instytut pilnuje rejestru jak wujek miejsca parkingowego, więc pyta dwa razy.",
        ],
        button: link ? { href: link, label: "Potwierdzam zmianę" } : undefined,
        code: token ? { label: "Kod potwierdzający:", value: token } : undefined,
        note: IGNORE,
      };

    case "recovery":
      return {
        subject: "Odzyskanie dostępu do Profilu Dziaderskiego",
        preheader: "Jedno kliknięcie przywraca dostęp do profilu.",
        department: "Rejestracja",
        title: "Odzyskanie dostępu",
        paragraphs: ["Na ten adres zamówiono odzyskanie dostępu do Profilu Dziaderskiego. Przycisk poniżej wpuści cię z powrotem."],
        button: link ? { href: link, label: "Odzyskuję dostęp" } : undefined,
        code,
        note: IGNORE,
      };

    case "reauthentication":
      return token
        ? {
            subject: "Kod potwierdzający",
            preheader: `Kod: ${token}. Ważny przez kilka minut.`,
            department: "Rejestracja",
            title: "Kod potwierdzający",
            paragraphs: ["Instytut prosi o potwierdzenie, że to naprawdę ty. Przepisz kod tam, gdzie o niego poproszono."],
            code: { label: "Kod:", value: token },
            note: IGNORE,
          }
        : null;

    default: {
      const notice = NOTIFICATIONS[type];
      return notice
        ? {
            subject: notice.title,
            preheader: notice.text,
            department: "Bezpieczeństwo",
            title: notice.title,
            paragraphs: [notice.text, "Jeśli to ty, nic nie trzeba robić. Jeśli nie ty, odpowiedz na tę wiadomość."],
            note: "Wiadomość wysłana automatycznie, bo w Profilu Dziaderskim zaszła zmiana.",
          }
        : null;
    }
  }
}
