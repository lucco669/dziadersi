import { WORD_OF_YEAR, type WordOfYear } from "@/content/word-of-year";

/*
 * Dziaderskie Słowo Roku: the phase of the vote and the Komisja's reading of the ballot box.
 * Pure functions, shared by the page, the report, the API and the tests.
 */

export type WordPhase = "upcoming" | "voting" | "closed" | "announced";

/** Votes per Polish dictionary slug. */
export type WordTally = Record<string, number>;

/**
 * The clock of the vote. IBD_SIMULATED_NOW (an ISO date) moves it for local checks of each phase
 * in a production build; it is never set in production.
 */
export function wordClock() {
  const simulated = process.env.IBD_SIMULATED_NOW;
  const date = simulated ? new Date(simulated) : new Date();
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export function phaseAt(now: Date, config: WordOfYear = WORD_OF_YEAR): WordPhase {
  const time = now.getTime();
  if (time < Date.parse(config.opens)) return "upcoming";
  if (time < Date.parse(config.closes)) return "voting";
  if (time < Date.parse(config.announced)) return "closed";
  return "announced";
}

export const totalOf = (tally: WordTally | null) =>
  tally ? WORD_OF_YEAR.nominees.reduce((sum, nominee) => sum + (tally[nominee.slug] ?? 0), 0) : 0;

export type Standing = { slug: string; votes: number; share: number };

/** Nominees by votes; equal votes keep the order of the shortlist. Shares in whole percent. */
export function standings(tally: WordTally, config: WordOfYear = WORD_OF_YEAR): Standing[] {
  const total = config.nominees.reduce((sum, nominee) => sum + (tally[nominee.slug] ?? 0), 0);
  return config.nominees
    .map((nominee, order) => ({ slug: nominee.slug, votes: tally[nominee.slug] ?? 0, order }))
    .sort((a, b) => b.votes - a.votes || a.order - b.order)
    .map(({ slug, votes }) => ({ slug, votes, share: total ? Math.round((votes / total) * 100) : 0 }));
}

/**
 * How the word was chosen:
 * - "votes": the most votes;
 * - "tie": several phrases shared the most votes and the chair of the Komisja chose among them;
 * - "commission": fewer votes than the quorum, the Komisja chose the word itself;
 * - "no-data": the ballot box could not be read, the Komisja chose the word itself.
 */
export type WordDecision = "votes" | "tie" | "commission" | "no-data";

export type WordResult = {
  winner: string;
  decision: WordDecision;
  /** Votes cast; null when the ballot box could not be read. */
  total: number | null;
  /** The phrases that shared the most votes, in a tie. */
  tied: string[];
  standings: Standing[];
};

export function decide(tally: WordTally | null, config: WordOfYear = WORD_OF_YEAR): WordResult {
  if (!tally) return { winner: config.reserve, decision: "no-data", total: null, tied: [], standings: [] };
  const ranked = standings(tally, config);
  const total = ranked.reduce((sum, standing) => sum + standing.votes, 0);
  if (total < config.quorum) return { winner: config.reserve, decision: "commission", total, tied: [], standings: ranked };
  const top = ranked[0].votes;
  const tied = ranked.filter((standing) => standing.votes === top).map((standing) => standing.slug);
  if (tied.length === 1) return { winner: tied[0], decision: "votes", total, tied: [], standings: ranked };
  // The chair casts the deciding vote: for the Komisja's own choice if it is among them, else for the first nominated.
  const winner = tied.includes(config.reserve) ? config.reserve : tied[0];
  return { winner, decision: "tie", total, tied, standings: ranked };
}
