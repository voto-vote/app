export type ElectionStage =
  | "created"
  | "thesis-entry"
  | "answering"
  | "live"
  | "archived";

export type ElectionType = "parties" | "candidates" | "candidates-and-parties";

export type LocationType = "country" | "state" | "county" | "city" | "custom";

export type AdminElection = {
  id: number;
  groupId?: number;
  name: string;
  title: string;
  subtitle: string;
  description: string;
  electionDate: string;
  electionType: ElectionType;
  stage: ElectionStage;
  locationType: LocationType;
  location: string;
  companyName?: string; // For corporate elections
  supportedLocales: string[];
  defaultLocale: string;
  launchDate?: string;
  sundownDate?: string;
  settings: ElectionSettings;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
};

export type ElectionSettings = {
  faq: FAQItem[];
  survey: ElectionSurvey;
  callToAction?: CallToAction;
  thesisOrder: "random" | "configured";
  requireTranslationApproval: boolean;
  theming: ElectionTheming;
  algorithm: ElectionAlgorithm;
  matchFields: MatchField[];
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
  order: number;
};

export type ElectionSurvey = {
  before?: SurveyConfig;
  after?: SurveyConfig;
};

export type SurveyConfig = {
  enabled: boolean;
  endpoint: string;
  displayType: "embedded" | "link";
  frequency: number;
  title: string;
  description: string;
  buttonYes: string;
  buttonNo: string;
};

export type CallToAction = {
  enabled: boolean;
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
};

export type ElectionTheming = {
  logo?: string;
  primaryColor: string;
  backgroundImage?: string;
};

export type ElectionAlgorithm = {
  decisions: 3 | 5;
  matchType: ElectionType;
  weightedVotesLimit: number | false;
  matrix: number[][];
  liveMatchesVisible: boolean;
};

export type MatchField = {
  type: "district" | "description" | "list" | "website";
  value: string;
  required: boolean;
  show: boolean;
};

export type CreateElectionRequest = Omit<
  AdminElection,
  "id" | "createdAt" | "updatedAt" | "createdBy"
>;
export type UpdateElectionRequest = Partial<CreateElectionRequest>;
