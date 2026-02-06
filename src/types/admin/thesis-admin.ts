export type AdminThesis = {
  id: string;
  electionId: number;
  order: number;
  category?: string;
  translations: ThesisTranslation[];
  explanations: ThesisExplanation[];
  additionalInfo?: string;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
  derivedFromPoolId?: string; // If from premade pool
};

export type ThesisTranslation = {
  id: string;
  languageCode: string;
  title: string;
  text: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isAutoTranslated: boolean;
  approvedBy?: number;
  approvedAt?: string;
};

export type ThesisExplanation = {
  id: string;
  startOffset: number;
  endOffset: number;
  text: string; // Markdown
};

export type PremadeThesis = {
  id: string;
  category: string;
  originalLocale: string;
  translations: ThesisTranslation[];
  usageCount: number;
  shareable: boolean;
  authorInstanceId: number;
};

export type AIGrammarSuggestion = {
  original: string;
  suggestion: string;
  changes: TextChange[];
  hasDoubleNegation: boolean;
  doubleNegationDetails?: string;
};

export type TextChange = {
  type: "addition" | "deletion" | "modification";
  startOffset: number;
  endOffset: number;
  originalText: string;
  suggestedText: string;
};

export type CreateThesisRequest = Omit<
  AdminThesis,
  "id" | "createdAt" | "updatedAt" | "isLocked"
>;
export type UpdateThesisRequest = Partial<CreateThesisRequest>;
