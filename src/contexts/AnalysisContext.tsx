import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AnalysisState, TaskDefinition, DiagnosticData, DecisionLayers } from '@/types/ux-analysis';
import { classifyQuadrant } from '@/lib/ux-logic';

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
  };
  
  const loadPreset = (preset: { definition: Partial<TaskDefinition>; diagnostic: Partial<DiagnosticData>; layers: Partial<DecisionLayers> }) => {
    dispatch({ type: 'LOAD_PRESET', payload: preset });
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
        loadPreset
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