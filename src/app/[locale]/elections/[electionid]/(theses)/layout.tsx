"use client";

import { useEffect } from "react";
import { useThesesStore } from "@/stores/theses-store";
import { useLocale } from "next-intl";
import { useRandomStore } from "@/stores/random-store";
import { getTheses } from "@/actions/theses-action";
import { useElection } from "@/contexts/election-context";
import { getPartiesForInstance } from "@/actions/party-action";
import { getCandidatesByInstanceAndStatus } from "@/actions/candidate-action";

export default function ElectionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { election } = useElection();
  const { setTheses, clearTheses } = useThesesStore();
  const locale = useLocale();
  const { seed } = useRandomStore();

  useEffect(() => {
    const random = createSeededRandom(seed);
    getTheses(election.id, locale, election.title, election.subtitle).then(
      (theses) => {
        const shuffledTheses = shuffle(theses, random);
        setTheses(shuffledTheses, election.id);
      }
    );

    getPartiesForInstance(election.id).then((parties) => {
      // Assuming you have a store or context to set parties
      // setParties(parties);
    });

    getCandidatesByInstanceAndStatus(election.id).then((candidates) => {
      // Assuming you have a store or context to set candidates
      // setCandidates(candidates);
    });


    return () => {
      clearTheses();
    };
  }, [clearTheses, election, locale, seed, setTheses]);
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
