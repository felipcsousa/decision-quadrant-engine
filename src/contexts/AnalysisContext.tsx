import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AnalysisState, TaskDefinition, DiagnosticData, DecisionLayers } from '@/types/ux-analysis';
import { classifyQuadrant } from '@/lib/ux-logic';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnalysisContextType {
  state: AnalysisState;
  updateDefinition: (definition: Partial<TaskDefinition>) => void;
  updateDiagnostic: (diagnostic: Partial<DiagnosticData>) => void;
  updateLayers: (layers: Partial<DecisionLayers>) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
  loadPreset: (preset: { definition: Partial<TaskDefinition>; diagnostic: Partial<DiagnosticData>; layers: Partial<DecisionLayers> }) => void;
  loadAnalysis: (id: string) => Promise<void>;
  saveAnalysis: (completed?: boolean) => Promise<string | null>;
  aiSuggestionsGenerated: boolean;
  generateAISuggestions: () => Promise<void>;
  currentAnalysisId: string | null;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

type AnalysisAction =
  | { type: 'UPDATE_DEFINITION'; payload: Partial<TaskDefinition> }
  | { type: 'UPDATE_DIAGNOSTIC'; payload: Partial<DiagnosticData> }
  | { type: 'UPDATE_LAYERS'; payload: Partial<DecisionLayers> }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'RESET' }
  | { type: 'LOAD_PRESET'; payload: { definition: Partial<TaskDefinition>; diagnostic: Partial<DiagnosticData>; layers: Partial<DecisionLayers> } };

const initialState: AnalysisState = {
  currentStep: 0,
  definition: {
    name: '',
    description: '',
    jtbd: ''
  },
  diagnostic: {
    frequency: 3,
    information: 3
  },
  layers: {
    risk: 'baixo',
    uncertainty: 'baixa',
    urgency: 'baixa'
  },
  quadrant: null,
  needsEvidence: false
};

const initialAIState = {
  aiSuggestionsGenerated: false,
  currentAnalysisId: null as string | null
};

function analysisReducer(state: AnalysisState, action: AnalysisAction): AnalysisState {
  switch (action.type) {
    case 'UPDATE_DEFINITION':
      return {
        ...state,
        definition: { ...state.definition, ...action.payload }
      };
    
    case 'UPDATE_DIAGNOSTIC': {
      const newDiagnostic = { ...state.diagnostic, ...action.payload };
      const classification = classifyQuadrant(
        newDiagnostic.frequency,
        newDiagnostic.information,
        newDiagnostic.frequencyDir,
        newDiagnostic.informationDir
      );
      
      return {
        ...state,
        diagnostic: newDiagnostic,
        quadrant: classification.quadrant,
        needsEvidence: classification.needsEvidence
      };
    }
    
    case 'UPDATE_LAYERS':
      return {
        ...state,
        layers: { ...state.layers, ...action.payload }
      };
    
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, 4)
      };
    
    case 'PREVIOUS_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0)
      };
    
    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: Math.max(0, Math.min(action.payload, 4))
      };
    
    case 'RESET':
      return initialState;
    
    case 'LOAD_PRESET': {
      const newDefinition = { ...state.definition, ...action.payload.definition };
      const newDiagnostic = { ...state.diagnostic, ...action.payload.diagnostic };
      const newLayers = { ...state.layers, ...action.payload.layers };
      
      const classification = classifyQuadrant(
        newDiagnostic.frequency,
        newDiagnostic.information,
        newDiagnostic.frequencyDir,
        newDiagnostic.informationDir
      );
      
      return {
        ...state,
        definition: newDefinition,
        diagnostic: newDiagnostic,
        layers: newLayers,
        quadrant: classification.quadrant,
        needsEvidence: classification.needsEvidence,
        currentStep: 1
      };
    }
    
    default:
      return state;
  }
}

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(analysisReducer, initialState);
  const [aiState, setAIState] = React.useState(initialAIState);
  const { toast } = useToast();
  
  const updateDefinition = (definition: Partial<TaskDefinition>) => {
    dispatch({ type: 'UPDATE_DEFINITION', payload: definition });
  };
  
  const updateDiagnostic = (diagnostic: Partial<DiagnosticData>) => {
    dispatch({ type: 'UPDATE_DIAGNOSTIC', payload: diagnostic });
  };
  
  const updateLayers = (layers: Partial<DecisionLayers>) => {
    dispatch({ type: 'UPDATE_LAYERS', payload: layers });
  };
  
  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };
  
  const previousStep = () => {
    dispatch({ type: 'PREVIOUS_STEP' });
  };
  
  const goToStep = (step: number) => {
    dispatch({ type: 'GO_TO_STEP', payload: step });
  };
  
  const reset = () => {
    dispatch({ type: 'RESET' });
    setAIState(initialAIState);
  };
  
  const loadPreset = (preset: { definition: Partial<TaskDefinition>; diagnostic: Partial<DiagnosticData>; layers: Partial<DecisionLayers> }) => {
    dispatch({ type: 'LOAD_PRESET', payload: preset });
    setAIState(initialAIState);
  };

  const saveAnalysis = async (completed = false): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('save-analysis', {
        body: {
          id: aiState.currentAnalysisId,
          definition: state.definition,
          diagnostic: state.diagnostic,
          layers: state.layers,
          quadrant: state.quadrant,
          aiSuggestionsGenerated: aiState.aiSuggestionsGenerated,
          completed
        }
      });

      if (error) throw error;

      if (data.id && !aiState.currentAnalysisId) {
        setAIState(prev => ({ ...prev, currentAnalysisId: data.id }));
      }

      toast({
        title: 'Análise salva',
        description: 'Sua análise foi salva com sucesso',
      });

      return data.id;
    } catch (error) {
      console.error('Error saving analysis:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar a análise',
        variant: 'destructive',
      });
      return null;
    }
  };

  const loadAnalysis = async (id: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('get-analysis-detail', {
        body: { id }
      });

      if (error) throw error;

      const analysis = data.analysis;
      
      dispatch({
        type: 'LOAD_PRESET',
        payload: {
          definition: {
            name: analysis.name,
            description: analysis.description,
            jtbd: analysis.jtbd
          },
          diagnostic: {
            frequency: analysis.frequency,
            information: analysis.information,
            frequencyDir: analysis.frequencyDir,
            informationDir: analysis.informationDir,
            frequencyEvidence: analysis.frequencyEvidence,
            informationEvidence: analysis.informationEvidence
          },
          layers: {
            risk: analysis.risk,
            uncertainty: analysis.uncertainty,
            urgency: analysis.urgency,
            collaboration: analysis.collaboration
          }
        }
      });

      setAIState({
        aiSuggestionsGenerated: analysis.aiSuggestionsGenerated,
        currentAnalysisId: id
      });

      toast({
        title: 'Análise carregada',
        description: 'Análise recuperada com sucesso',
      });
    } catch (error) {
      console.error('Error loading analysis:', error);
      toast({
        title: 'Erro ao carregar',
        description: 'Não foi possível carregar a análise',
        variant: 'destructive',
      });
    }
  };

  const generateAISuggestions = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAIState(prev => ({ ...prev, aiSuggestionsGenerated: true }));

      // Auto-save after generating AI suggestions
      if (state.quadrant) {
        await saveAnalysis(false);
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
    }
  };
  
  return (
    <AnalysisContext.Provider
      value={{
        state,
        updateDefinition,
        updateDiagnostic,
        updateLayers,
        nextStep,
        previousStep,
        goToStep,
        reset,
        loadPreset,
        loadAnalysis,
        saveAnalysis,
        aiSuggestionsGenerated: aiState.aiSuggestionsGenerated,
        generateAISuggestions,
        currentAnalysisId: aiState.currentAnalysisId
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}