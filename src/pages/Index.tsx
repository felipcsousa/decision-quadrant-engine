import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalysisProvider, useAnalysis } from '@/contexts/AnalysisContext';
import { useAuth } from '@/contexts/AuthContext';
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
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AnalysisProvider>
      <AnalysisFlow />
    </AnalysisProvider>
  );
};

export default Index;
