import type { Locale } from "@/i18n/config";
import { defineCopy } from "@/i18n/copy";
import type { Letter } from "./layout";

/*
 * Auth emails, written by the Institute's registry. Supabase decides when to send them
 * (the Send Email Hook); these decide what they say, in the edition the reader signed in from.
 */

export type AuthEmail = {
  /** Supabase's email_action_type. */
  type: string;
  /** Where the button leads: our /auth/potwierdz with the token hash. */
  link?: string;
  /** The six-digit one-time code. */
  token?: string;
};

type Notice = { title: string; text: string };

const COPY = defineCopy({
  pl: {
    ignore: "Jeśli to nie ty, zignoruj tę wiadomość. Instytut niczego nie zrobi, najwyżej się zdziwi.",
    codeLabel: "Albo przepisz kod w oknie logowania:",
    registry: "Rejestracja",
    security: "Bezpieczeństwo",
    magiclink: {
      subject: "Skierowanie do Profilu Dziaderskiego",
      preheader: "Jedno kliknięcie i jesteś w profilu. Hasło nie jest potrzebne.",
      paragraphs: [
        "Na ten adres zamówiono wejście do Profilu Dziaderskiego. Wystarczy kliknąć przycisk poniżej, hasło nie jest potrzebne.",
        "Skierowanie jest ważne przez godzinę i działa jeden raz, jak karta obiegowa.",
      ],
      button: "Wchodzę do profilu",
    },
    signup: {
      subject: (invite: boolean): string => (invite ? "Zaproszenie do Instytutu Badań nad Dziaderstwem" : "Witamy w rejestrze Instytutu"),
      preheader: "Potwierdź adres, a Instytut założy Profil Dziaderski.",
      title: (invite: boolean): string => (invite ? "Zaproszenie do rejestru" : "Witamy w rejestrze"),
      intro: (invite: boolean): string =>
        invite
          ? "Ktoś zgłosił ten adres do rejestru Instytutu. Wystarczy potwierdzić go przyciskiem poniżej, a Profil Dziaderski będzie gotowy."
          : "Instytut przyjął zgłoszenie. Wystarczy potwierdzić adres przyciskiem poniżej, a Profil Dziaderski będzie gotowy.",
      more: "W profilu zapiszesz wyniki badań, zbierzesz gatunki do kolekcji i dostaniesz odznaki. Następnym razem możesz zalogować się swoim hasłem, przez Google lub linkiem z e-maila.",
      button: "Potwierdzam adres",
    },
    change: {
      subject: "Potwierdzenie zmiany adresu",
      preheader: "Profil Dziaderski przenosi się na nowy adres. Potrzebne potwierdzenie.",
      paragraphs: [
        "W Profilu Dziaderskim poproszono o zmianę adresu e-mail. Zmiana wejdzie w życie po potwierdzeniu.",
        "Instytut pilnuje rejestru jak wujek miejsca parkingowego, więc pyta dwa razy.",
      ],
      button: "Potwierdzam zmianę",
      codeLabel: "Kod potwierdzający:",
    },
    recovery: {
      subject: "Odzyskanie dostępu do Profilu Dziaderskiego",
      preheader: "Ustaw nowe hasło do swojego profilu.",
      title: "Odzyskanie dostępu",
      paragraphs: ["Na ten adres zamówiono zmianę hasła do Profilu Dziaderskiego. Kliknij przycisk poniżej i ustaw nowe hasło.", "Link działa jeden raz. Jeśli wygaśnie, zamów nowy w oknie logowania."],
      button: "Ustawiam nowe hasło",
    },
    reauthentication: {
      subject: "Kod potwierdzający",
      preheader: (token: string) => `Kod: ${token}. Ważny przez kilka minut.`,
      paragraphs: ["Instytut prosi o potwierdzenie, że to naprawdę ty. Przepisz kod tam, gdzie o niego poproszono."],
      codeLabel: "Kod:",
    },
    notifications: {
      email_changed_notification: {
        title: "Adres e-mail zmieniony",
        text: "Adres e-mail przypisany do Profilu Dziaderskiego został właśnie zmieniony.",
      },
      password_changed_notification: {
        title: "Hasło zmienione",
        text: "Hasło do Profilu Dziaderskiego zostało zmienione.",
      },
      identity_linked_notification: {
        title: "Nowy sposób logowania",
        text: "Do Profilu Dziaderskiego dodano nowy sposób logowania.",
      },
      identity_unlinked_notification: {
        title: "Usunięty sposób logowania",
        text: "Z Profilu Dziaderskiego usunięto jeden ze sposobów logowania.",
      },
    } as Record<string, Notice>,
    noticeReply: "Jeśli to ty, nic nie trzeba robić. Jeśli nie ty, odpowiedz na tę wiadomość.",
    noticeNote: "Wiadomość wysłana automatycznie, bo w Profilu Dziaderskim zaszła zmiana.",
  },
  sl: {
    ignore: "Če to nisi ti, sporočilo prezri. Inštitut ne bo storil ničesar, kvečjemu se bo začudil.",
    codeLabel: "Ali pa kodo prepiši v okno za prijavo:",
    registry: "Prijavna služba",
    security: "Varnost",
    magiclink: {
      subject: "Napotnica za Dziaderski profil",
      preheader: "En klik in si v profilu. Gesla ne potrebuješ.",
      paragraphs: [
        "Na ta naslov je bil naročen vstop v Dziaderski profil. Dovolj je klik na spodnji gumb, gesla ne potrebuješ.",
        "Napotnica velja eno uro in deluje enkrat, kot obhodni list.",
      ],
      button: "Vstopam v profil",
    },
    signup: {
      subject: (invite: boolean): string => (invite ? "Vabilo na Inštitut za raziskave dziaderstva" : "Dobrodošli v registru Inštituta"),
      preheader: "Potrdi naslov in Inštitut ti odpre Dziaderski profil.",
      title: (invite: boolean): string => (invite ? "Vabilo v register" : "Dobrodošli v registru"),
      intro: (invite: boolean): string =>
        invite
          ? "Nekdo je ta naslov prijavil v register Inštituta. Dovolj je, da ga potrdiš s spodnjim gumbom, in Dziaderski profil bo pripravljen."
          : "Inštitut je prijavo sprejel. Dovolj je, da naslov potrdiš s spodnjim gumbom, in Dziaderski profil bo pripravljen.",
      more: "V profilu shranjuješ izvide, zbiraš vrste v zbirko in prejemaš značke. Naslednjič se lahko prijaviš s svojim geslom, z Googlom ali s povezavo iz e-pošte.",
      button: "Potrjujem naslov",
    },
    change: {
      subject: "Potrditev spremembe naslova",
      preheader: "Dziaderski profil se seli na nov naslov. Potrebna je potrditev.",
      paragraphs: [
        "V Dziaderskem profilu je bila zahtevana sprememba e-naslova. Sprememba začne veljati po potrditvi.",
        "Inštitut pazi na register kot stric na svoje parkirno mesto, zato vpraša dvakrat.",
      ],
      button: "Potrjujem spremembo",
      codeLabel: "Potrditvena koda:",
    },
    recovery: {
      subject: "Obnovitev dostopa do Dziaderskega profila",
      preheader: "Nastavi novo geslo za svoj profil.",
      title: "Obnovitev dostopa",
      paragraphs: ["Na ta naslov je bila naročena sprememba gesla za Dziaderski profil. Klikni spodnji gumb in nastavi novo geslo.", "Povezava deluje enkrat. Če poteče, v oknu za prijavo naroči novo."],
      button: "Nastavljam novo geslo",
    },
    reauthentication: {
      subject: "Potrditvena koda",
      preheader: (token: string) => `Koda: ${token}. Velja nekaj minut.`,
      paragraphs: ["Inštitut prosi za potrditev, da si res ti. Kodo prepiši tja, kjer so jo zahtevali."],
      codeLabel: "Koda:",
    },
    notifications: {
      email_changed_notification: {
        title: "E-naslov spremenjen",
        text: "E-naslov, vezan na Dziaderski profil, je bil pravkar spremenjen.",
      },
      password_changed_notification: {
        title: "Geslo spremenjeno",
        text: "Geslo za Dziaderski profil je bilo spremenjeno.",
      },
      identity_linked_notification: {
        title: "Nov način prijave",
        text: "Dziaderskemu profilu je bil dodan nov način prijave.",
      },
      identity_unlinked_notification: {
        title: "Odstranjen način prijave",
        text: "Iz Dziaderskega profila je bil odstranjen eden od načinov prijave.",
      },
    },
    noticeReply: "Če je bilo to tvoje delo, ni treba storiti ničesar. Če ni bilo, odgovori na to sporočilo.",
    noticeNote: "Sporočilo je bilo poslano samodejno, ker je v Dziaderskem profilu prišlo do spremembe.",
  },
});

/** The letter for one of Supabase's emails, in the edition `locale`; null for types the Institute doesn't send. */
export function authLetter({ type, link, token }: AuthEmail, locale: Locale): Letter | null {
  const t = COPY[locale];
  const code = token ? { label: t.codeLabel, value: token } : undefined;

  switch (type) {
    case "magiclink":
    case "email":
      return {
        subject: t.magiclink.subject,
        preheader: t.magiclink.preheader,
        department: t.registry,
        title: t.magiclink.subject,
        paragraphs: t.magiclink.paragraphs,
        button: link ? { href: link, label: t.magiclink.button } : undefined,
        code,
        note: t.ignore,
      };

    case "signup":
    case "invite": {
      const invite = type === "invite";
      return {
        subject: t.signup.subject(invite),
        preheader: t.signup.preheader,
        department: t.registry,
        title: t.signup.title(invite),
        paragraphs: [t.signup.intro(invite), t.signup.more],
        button: link ? { href: link, label: t.signup.button } : undefined,
        code,
        note: t.ignore,
      };
    }

    case "email_change":
      return {
        subject: t.change.subject,
        preheader: t.change.preheader,
        department: t.registry,
        title: t.change.subject,
        paragraphs: t.change.paragraphs,
        button: link ? { href: link, label: t.change.button } : undefined,
        code: token ? { label: t.change.codeLabel, value: token } : undefined,
        note: t.ignore,
      };

    case "recovery":
      return {
        subject: t.recovery.subject,
        preheader: t.recovery.preheader,
        department: t.registry,
        title: t.recovery.title,
        paragraphs: t.recovery.paragraphs,
        button: link ? { href: link, label: t.recovery.button } : undefined,
        note: t.ignore,
      };

    case "reauthentication":
      return token
        ? {
            subject: t.reauthentication.subject,
            preheader: t.reauthentication.preheader(token),
            department: t.registry,
            title: t.reauthentication.subject,
            paragraphs: t.reauthentication.paragraphs,
            code: { label: t.reauthentication.codeLabel, value: token },
            note: t.ignore,
          }
        : null;

    default: {
      const notice = t.notifications[type];
      return notice
        ? {
            subject: notice.title,
            preheader: notice.text,
            department: t.security,
            title: notice.title,
            paragraphs: [notice.text, t.noticeReply],
            note: t.noticeNote,
          }
        : null;
    }
  }
}
