// Core types based on PRD

export interface WritingError {
  id: string;
  type: 'spelling' | 'punctuation' | 'syntax' | 'style';
  startIndex: number;
  endIndex: number;
  original: string;
  suggestion: string;
  confidence: number;
  explanation: string;
  source: 'local' | 'cloud';
}

export interface ToneSettings {
  formality: number; // 0-1
  expertise: 'novice' | 'intermediate' | 'expert';
}

export interface SimplificationResult {
  simplified: string;
  analogies: Array<{
    concept: string;
    analogy: string;
    relevance: number;
  }>;
  jargonMap: Array<{
    term: string;
    simplified: string;
  }>;
}

export interface MeaningFragment {
  id: string;
  type: 'ambiguous-claim' | 'unsupported-assertion' | 'vague-pronoun' | 'logical-gap';
  location: { start: number; end: number };
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
  reasoning: string;
}

export interface FlowMetrics {
  flowScore: number;
  metrics: {
    sentenceVariety: number;
    transitionDensity: number;
    passiveVoiceRatio: number;
    fleschKincaidGrade: number;
  };
  recommendations: Array<{
    type: string;
    priority: 'high' | 'medium' | 'low';
    tip: string;
  }>;
  trend: 'improving' | 'stable' | 'declining';
}

export type EditorMode = 'write' | 'analyze-meaning' | 'simplify' | 'tone';

// Pricing & Plans
export type UserPlan = 'free' | 'pro';

export interface PlanLimits {
  maxTokens: number;
  meaningMap: boolean;
  flowTrainer: boolean;
  historyDays: number | string;
}