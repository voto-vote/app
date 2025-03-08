import { create } from "zustand";

type Thesis = {
  id: string;
  category: string;
  thesis: string;
  additionalInformation?: string;
};

type Election = {
  id: string;
  name: string;
  location: string;
  date: Date;
  theses: Thesis[];
  thesesPerBreak: number;
};

type StoreState = {
  election: Election | undefined;
};

type StoreActions = {
  setElection: (election: Election) => void;
};

type Store = StoreState & StoreActions;

export const useStore = create<Store>((set) => ({
  election: undefined,
  run: undefined,
  setElection: (election) => set({ election }),
}));

// TODO TMP
const { setElection } = useStore.getState();
setElection({
  id: "1",
  name: "Gemeinderat",
  location: "Musterstadt",
  date: new Date(2025, 2, 2),
  theses: [
    {
      id: "1",
      category: "Familienpolitik",
      thesis:
        "In den Volksschulen soll das Familienbild Vater-Mutter-Kind nicht vorrangig vermittelt werden.",
      additionalInformation:
        "Die These behandelt, ob das traditionelle Familienbild (Vater-Mutter-Kind) in Volksschulen vorrangig vermittelt werden sollte.\nIn der heutigen Gesellschaft existieren verschiedene Familienformen: Alleinerziehende, Patchwork-Familien und Regenbogenfamilien. Die Debatte bewegt sich zwischen der Wertschätzung traditioneller Familienmodelle und der Anerkennung gesellschaftlicher Vielfalt im Bildungsbereich.",
    },
    {
      id: "2",
      category: "Klimaschutz",
      thesis:
        "Deutschland soll Vorbild beim Klimaschutz sein, auch wenn andere Länder nicht mitmachen.",
    },
    {
      id: "3",
      category: "Wirtschaft",
      thesis:
        "Im Burgenland sollen keine weiteren interkommunalen Businessparks auf unbebauten Flächen errichtet werden.",
    },
    {
      id: "4",
      category: "Familienpolitik",
      thesis:
        "In den Volksschulen soll das Familienbild Vater-Mutter-Kind nicht vorrangig vermittelt werden.",
      additionalInformation:
        "Die These behandelt, ob das traditionelle Familienbild (Vater-Mutter-Kind) in Volksschulen vorrangig vermittelt werden sollte.\nIn der heutigen Gesellschaft existieren verschiedene Familienformen: Alleinerziehende, Patchwork-Familien und Regenbogenfamilien. Die Debatte bewegt sich zwischen der Wertschätzung traditioneller Familienmodelle und der Anerkennung gesellschaftlicher Vielfalt im Bildungsbereich.",
    },
    {
      id: "5",
      category: "Klimaschutz",
      thesis:
        "Deutschland soll Vorbild beim Klimaschutz sein, auch wenn andere Länder nicht mitmachen.",
    },
    {
      id: "6",
      category: "Wirtschaft",
      thesis:
        "Im Burgenland sollen keine weiteren interkommunalen Businessparks auf unbebauten Flächen errichtet werden.",
    },
    {
      id: "7",
      category: "Familienpolitik",
      thesis:
        "In den Volksschulen soll das Familienbild Vater-Mutter-Kind nicht vorrangig vermittelt werden.",
      additionalInformation:
        "Die These behandelt, ob das traditionelle Familienbild (Vater-Mutter-Kind) in Volksschulen vorrangig vermittelt werden sollte.\nIn der heutigen Gesellschaft existieren verschiedene Familienformen: Alleinerziehende, Patchwork-Familien und Regenbogenfamilien. Die Debatte bewegt sich zwischen der Wertschätzung traditioneller Familienmodelle und der Anerkennung gesellschaftlicher Vielfalt im Bildungsbereich.",
    },
    {
      id: "8",
      category: "Klimaschutz",
      thesis:
        "Deutschland soll Vorbild beim Klimaschutz sein, auch wenn andere Länder nicht mitmachen.",
    },
    {
      id: "9",
      category: "Wirtschaft",
      thesis:
        "Im Burgenland sollen keine weiteren interkommunalen Businessparks auf unbebauten Flächen errichtet werden.",
    },
  ],
  thesesPerBreak: 5,
});
