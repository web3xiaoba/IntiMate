export interface DimensionItem {
  id: string;
  label: string;
  subLabel?: string;
  reverse?: boolean; // If true, a high score is negative (e.g., Risk factors)
}

export interface Dimension {
  id: string;
  title: string;
  description: string;
  items: DimensionItem[];
}

export interface Scores {
  [itemId: string]: {
    self: number;
    partner: number;
  };
}

export interface AnalysisResult {
  overallScore: number;
  dimensionScores: {
    dimensionId: string;
    dimensionName: string;
    score: number; // 0-100 normalized
    gap: number; // Average gap between partners
  }[];
  aiAnalysis: string; // Markdown content from Gemini
}

export enum Step {
  intro = 'intro',
  assessment = 'assessment',
  analyzing = 'analyzing',
  results = 'results'
}
