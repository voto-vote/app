export type Election = {
  id: number;
  electionDate: string;
  title: string;
  subtitle: string;
  image: string;
  locales: string[];
  defaultLocale: string;
  description: string;
  launchDate: string;
  status: Status;
  private: boolean;
  intro: Intro[];
  matchFields: MatchField[];
  algorithm: Algorithm;
  survey: Survey;
  theming: Theming;
  faqs: FAQ[];
  disableLiveVotes: boolean;
};

export type Status =
  | "created"
  | "in-preparation"
  | "ready-to-launch"
  | "live"
  | "deactivated";

export type Intro = {
  image: string;
  title: string;
  description: string;
};

export type MatchField = {
  type: "district" | "description" | "list" | "website";
  value: string;
  required: boolean;
  show: boolean;
};

export type Algorithm = {
  decisions: number;
  matchType: "candidates" | "parties" | "candidates-and-parties";
  weightedVotesLimit: number | false;
  matrix: number[][];
};

export type Survey = {
  beforeTheses: SurveyContent;
  afterTheses: SurveyContent;
};

export type SurveyContent =
  | false
  | {
      enabled: true;
      endpoint: string;
      frequency: number;
      title: string;
      description: string;
      yes: string;
      no: string;
    };

export type Theming = {
  logo: string;
  primary: string;
};

export type FAQ = {
  question: string;
  answer: string;
};
