import { AnalysisProvider, useAnalysis } from '@/contexts/AnalysisContext';
import { LandingPage } from '@/components/LandingPage';
import { DefinitionStep } from '@/components/DefinitionStep';
import { DiagnosticStep } from '@/components/DiagnosticStep';
import { LayersStep } from '@/components/LayersStep';
import { ReportStep } from '@/components/ReportStep';

function AnalysisFlow() {
  const { state } = useAnalysis();

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return <LandingPage />;
      case 1:
        return <DefinitionStep />;
      case 2:
        return <DiagnosticStep />;
      case 3:
        return <LayersStep />;
      case 4:
        return <ReportStep />;
      default:
        return <LandingPage />;
    }
  };

  return renderStep();
}

const Index = () => {
  return (
    <AnalysisProvider>
      <AnalysisFlow />
    </AnalysisProvider>
  );
};

export default Index;
