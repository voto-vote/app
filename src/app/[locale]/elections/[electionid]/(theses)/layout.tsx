"use client";

import { useEffect } from "react";
import { useThesesStore } from "@/stores/theses-store";
import { usePartiesStore } from "@/stores/party-store";
import { useCandidatesStore } from "@/stores/candidate-store";
import { useLocale } from "next-intl";
import { useRandomStore } from "@/stores/random-store";
import { getTheses } from "@/actions/theses-action";
import { useElection } from "@/contexts/election-context";
import { getVotedParties } from "@/actions/party-action";
import { getVotedCandidates } from "@/actions/candidate-action";
import { useResultStore } from "@/stores/result-store";
import { calculateResults } from "@/lib/result-calculator";
import { useRatingsStore } from "@/stores/ratings-store";

export default function ElectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { election } = useElection();
  const { setTheses, clearTheses } = useThesesStore();
  const { ratings } = useRatingsStore();
  const { parties, setParties, clearParties } = usePartiesStore();
  const { candidates, setCandidates, clearCandidates } = useCandidatesStore();
  const { setResults, clearResults } = useResultStore();
  const locale = useLocale();
  const { seed } = useRandomStore();

  // When entering the (theses) page, fetch theses and candidates/parties
  useEffect(() => {
    const random = createSeededRandom(seed);
    getTheses(election.id, locale, election.title, election.subtitle).then(
      (theses) => {
        const shuffledTheses = shuffle(theses, random);
        setTheses(shuffledTheses);
      }
    );

    if (
      election.algorithm.matchType === "candidates" ||
      election.algorithm.matchType === "candidates-and-parties"
    ) {
      getVotedCandidates(election.id).then((candidates) => {
        setCandidates(candidates);
      });
    }
    if (
      election.algorithm.matchType === "parties" ||
      election.algorithm.matchType === "candidates-and-parties"
    ) {
      getVotedParties(election.id).then((parties) => {
        setParties(parties);
      });
    }

    return () => {
      clearTheses();
      clearParties();
      clearCandidates();
    };
  }, [
    clearCandidates,
    clearParties,
    clearTheses,
    election,
    locale,
    seed,
    setCandidates,
    setParties,
    setTheses,
  ]);

  // Whenever the ratings change, recalculate the results
  useEffect(() => {
    const electionRatings = ratings[election.id] ?? {};

    const results = calculateResults(
      electionRatings,
      election.algorithm.matrix,
      parties,
      candidates
    );

    setResults(results);

    return () => {
      clearResults();
    };
  }, [
    candidates,
    clearResults,
    election.algorithm.matrix,
    election.id,
    parties,
    ratings,
    setResults,
  ]);

  return children;
}

/**
 * SplitMix32
 * https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
 * @param seed A random seed value
 * @returns
 */
function createSeededRandom(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x9e3779b9) | 0;
    let t = seed ^ (seed >>> 16);
    t = Math.imul(t, 0x21f0aaad);
    t = t ^ (t >>> 15);
    t = Math.imul(t, 0x735a2d97);
    return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(
  array: Array<T>,
  random: () => number = Math.random
): Array<T> {
  let currentIndex = array.length;
  const newArray = [...array];

  while (currentIndex != 0) {
    const randomIndex = Math.floor(random() * currentIndex);
    currentIndex--;

    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];
  }

  return newArray;
}
