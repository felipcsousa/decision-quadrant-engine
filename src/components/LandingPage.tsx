import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { useAuth } from '@/contexts/AuthContext';
import { NUDGE_PRESETS } from '@/lib/ux-logic';
import { ChevronRight, Zap, LogOut } from 'lucide-react';

export function LandingPage() {
  const { nextStep, loadPreset } = useAnalysis();
  const { user, signOut } = useAuth();

  const handleNudgeClick = (presetId: string) => {
    const preset = NUDGE_PRESETS.find(p => p.id === presetId);
    if (preset) {
      loadPreset(preset.presets);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-16">
        {/* User menu */}
        {user && (
          <div className="flex justify-end mb-8">
            <div className="flex items-center gap-4">
              <span className="text-sm text-text-secondary">
                {user.email}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={signOut}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 bg-accent/50 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-accent-foreground" />
              <span className="text-sm font-medium text-accent-foreground">Metodologia UX 2×2</span>
            </div>
            
            <h1 className="text-5xl font-bold text-text-primary mb-6 leading-tight">
              Análise UX baseada em
              <span className="text-text-primary block">
                Frequência × Informação
              </span>
            </h1>
            
            <p className="text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Classifique suas tarefas em quadrantes e receba padrões de design personalizados 
              para criar experiências otimizadas.
            </p>
          </div>

          {/* CTA Principal */}
          <div className="mb-20">
            <Button 
              size="lg" 
              onClick={nextStep}
              className="bg-primary text-primary-foreground hover:bg-primary-hover px-8 py-6 text-lg font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              Nova Análise
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Nudges */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-text-primary mb-8">
              Ou comece com um exemplo prático
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {NUDGE_PRESETS.map((preset) => (
                <Card 
                  key={preset.id}
                  className="cursor-pointer hover:shadow-md transition-all border-border/50 hover:border-border group"
                  onClick={() => handleNudgeClick(preset.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-${preset.quadrant.toLowerCase()}`} />
                        <CardTitle className="text-lg font-semibold text-text-primary">
                          {preset.title}
                        </CardTitle>
                      </div>
                      <span className="text-xs font-medium text-text-tertiary bg-muted px-2 py-1 rounded">
                        {preset.quadrant}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-text-secondary">
                      {preset.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}