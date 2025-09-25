export type Likert = 1 | 2 | 3 | 4 | 5;
export type Level3Dir = 'baixo' | 'alto';
export type AxisLevel = 'baixo' | 'alto' | 'indefinido';
export type Quadrant = 'Q1' | 'Q2' | 'Q3' | 'Q4';
export type RiskLevel = 'baixo' | 'médio' | 'alto';
export type UncertaintyLevel = 'baixa' | 'média' | 'alta';
export type UrgencyLevel = 'baixa' | 'média' | 'alta';
export type CollaborationLevel = 'solo' | 'multi';

export interface TaskDefinition {
  name: string;
  description: string;
  jtbd: string; // Jobs to Be Done
}

export interface DiagnosticData {
  frequency: Likert;
  information: Likert;
  frequencyDir?: Level3Dir;
  informationDir?: Level3Dir;
  frequencyEvidence?: string;
  informationEvidence?: string;
}

export interface DecisionLayers {
  risk: RiskLevel;
  uncertainty: UncertaintyLevel;
  urgency: UrgencyLevel;
  collaboration?: CollaborationLevel;
}

export interface AnalysisState {
  currentStep: number;
  definition: TaskDefinition;
  diagnostic: DiagnosticData;
  layers: DecisionLayers;
  quadrant: Quadrant | null;
  needsEvidence: boolean;
}

export interface Pattern {
  name: string;
  description: string;
  category: 'base' | 'refinement';
  priority?: 'essential' | 'high' | 'medium' | 'low';
}

export interface Guardrail {
  metric: string;
  target: string;
  description: string;
  range?: string;
}

export interface ChecklistItem {
  category: 'regra_dos_4' | 'estados';
  item: string;
  status: 'pending' | 'completed' | 'needs_attention';
  description?: string;
}

export interface AnalysisReport {
  metadata: TaskDefinition;
  classification: {
    quadrant: Quadrant;
    archetype: string;
    mainGuideline: string;
    frequency: Likert;
    information: Likert;
    evidence?: {
      frequency?: string;
      information?: string;
    };
  };
  patterns: Pattern[];
  guardrails: Guardrail[];
  checklist: ChecklistItem[];
  pendencies: string[];
  overrides?: {
    notes: string;
    impact: string;
  };
}

export interface NudgePreset {
  id: string;
  title: string;
  description: string;
  quadrant: Quadrant;
  presets: {
    definition: Partial<TaskDefinition>;
    diagnostic: Partial<DiagnosticData>;
    layers: Partial<DecisionLayers>;
  };
}