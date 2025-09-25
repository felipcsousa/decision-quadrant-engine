import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import { Likert, Level3Dir } from '@/types/ux-analysis';

const FREQUENCY_ANCHORS = {
  1: 'Única/Excepcional',
  2: 'Rara (≤1×/trimestre)',
  3: 'Ocasional (≈mensal)',
  4: 'Frequente (≈semanal)', 
  5: 'Muito frequente (diária/multi)'
} as const;

const INFORMATION_ANCHORS = {
  1: 'Mínima (1-2 inputs)',
  2: 'Pouca (form simples)',
  3: 'Média (alguma comparação)',
  4: 'Alta (múltiplas fontes)',
  5: 'Extensa (análise complexa)'
} as const;

interface LikertScaleProps {
  value: Likert;
  onChange: (value: Likert) => void;
  anchors: Record<Likert, string>;
  label: string;
  needsEvidence: boolean;
  evidence?: string;
  onEvidenceChange: (evidence: string) => void;
  onDirectionChange: (dir: Level3Dir) => void;
}

function LikertScale({ 
  value, 
  onChange, 
  anchors, 
  label, 
  needsEvidence, 
  evidence, 
  onEvidenceChange,
  onDirectionChange 
}: LikertScaleProps) {
  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-text-primary">{label}</Label>
      
      <div className="space-y-3">
        {([1, 2, 3, 4, 5] as Likert[]).map((rating) => (
          <label
            key={rating}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              value === rating 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-border/80'
            }`}
          >
            <input
              type="radio"
              name={label}
              value={rating}
              checked={value === rating}
              onChange={() => onChange(rating)}
              className="text-primary focus:ring-primary"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-text-primary">{rating}</span>
                <span className="text-text-secondary">{anchors[rating]}</span>
              </div>
            </div>
          </label>
        ))}
      </div>

      {needsEvidence && value === 3 && (
        <div className="space-y-3 p-4 bg-accent/20 rounded-lg border border-accent/40">
          <Label className="text-sm font-medium text-accent-foreground">
            Evidência necessária para nota 3
          </Label>
          
          <div className="flex gap-2 mb-3">
            <Button
              type="button"
              size="sm"
              variant={evidence?.includes('baixo') ? 'default' : 'secondary'}
              onClick={() => onDirectionChange('baixo')}
            >
              Tender para Baixo
            </Button>
            <Button
              type="button"
              size="sm"
              variant={evidence?.includes('alto') ? 'default' : 'secondary'}
              onClick={() => onDirectionChange('alto')}
            >
              Tender para Alto
            </Button>
          </div>
          
          <Textarea
            placeholder="Descreva a evidência ou observação que justifica esta classificação..."
            value={evidence || ''}
            onChange={(e) => onEvidenceChange(e.target.value)}
            className="border-accent/30"
          />
        </div>
      )}
    </div>
  );
}

export function DiagnosticStep() {
  const { state, updateDiagnostic, nextStep, previousStep } = useAnalysis();
  const [quadrantPosition, setQuadrantPosition] = useState({ x: 50, y: 50 });

  const needsFreqEvidence = state.diagnostic.frequency === 3;
  const needsInfoEvidence = state.diagnostic.information === 3;
  const canProceed = (!needsFreqEvidence || state.diagnostic.frequencyEvidence) &&
                     (!needsInfoEvidence || state.diagnostic.informationEvidence);

  // Update matrix position based on values
  React.useEffect(() => {
    const freqPos = ((state.diagnostic.frequency - 1) / 4) * 80 + 10;
    const infoPos = 90 - (((state.diagnostic.information - 1) / 4) * 80 + 10);
    setQuadrantPosition({ x: freqPos, y: infoPos });
  }, [state.diagnostic.frequency, state.diagnostic.information]);

  const getQuadrantLabel = () => {
    const freq = state.diagnostic.frequency;
    const info = state.diagnostic.information;
    
    if (freq >= 4 && info <= 2) return 'Q1 - Rotina';
    if (freq >= 4 && info >= 4) return 'Q2 - Cockpit';
    if (freq <= 2 && info <= 2) return 'Q3 - Guiado';
    if (freq <= 2 && info >= 4) return 'Q4 - Decisão Pontual';
    return 'Posição no limiar';
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-text-primary mb-4">
              Diagnóstico 2×2
            </h1>
            <p className="text-lg text-text-secondary">
              Avalie a frequência de uso e quantidade de informação necessária
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Scales */}
            <div className="space-y-8">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-text-primary">Escalas de Avaliação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <LikertScale
                    value={state.diagnostic.frequency}
                    onChange={(freq) => updateDiagnostic({ frequency: freq })}
                    anchors={FREQUENCY_ANCHORS}
                    label="Frequência de Uso"
                    needsEvidence={needsFreqEvidence}
                    evidence={state.diagnostic.frequencyEvidence}
                    onEvidenceChange={(evidence) => updateDiagnostic({ frequencyEvidence: evidence })}
                    onDirectionChange={(dir) => updateDiagnostic({ frequencyDir: dir })}
                  />

                  <LikertScale
                    value={state.diagnostic.information}
                    onChange={(info) => updateDiagnostic({ information: info })}
                    anchors={INFORMATION_ANCHORS}
                    label="Quantidade de Informação"
                    needsEvidence={needsInfoEvidence}
                    evidence={state.diagnostic.informationEvidence}
                    onEvidenceChange={(evidence) => updateDiagnostic({ informationEvidence: evidence })}
                    onDirectionChange={(dir) => updateDiagnostic({ informationDir: dir })}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Matrix Visualization */}
            <div className="space-y-6">
              <Card className="border-border/50 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-text-primary">Matriz de Posicionamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full aspect-square bg-surface-sunken rounded-lg p-4">
                    {/* Grid lines */}
                    <svg className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)]">
                      <defs>
                        <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                          <path d="M 25 0 L 0 0 0 25" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" opacity="0.3"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      
                      {/* Center lines */}
                      <line x1="50%" y1="0" x2="50%" y2="100%" stroke="currentColor" strokeWidth="1" className="text-border" opacity="0.6"/>
                      <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="1" className="text-border" opacity="0.6"/>
                    </svg>

                    {/* Quadrant labels */}
                    <div className="absolute top-2 left-2 text-xs font-medium text-q2 bg-white/80 px-2 py-1 rounded">Q2</div>
                    <div className="absolute top-2 right-2 text-xs font-medium text-q1 bg-white/80 px-2 py-1 rounded">Q1</div>
                    <div className="absolute bottom-2 left-2 text-xs font-medium text-q3 bg-white/80 px-2 py-1 rounded">Q3</div>
                    <div className="absolute bottom-2 right-2 text-xs font-medium text-q4 bg-white/80 px-2 py-1 rounded">Q4</div>

                    {/* Position marker */}
                    <div
                      className="absolute w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg transform -translate-x-2 -translate-y-2 transition-all duration-300"
                      style={{
                        left: `${quadrantPosition.x}%`,
                        top: `${quadrantPosition.y}%`
                      }}
                    />
                  </div>

                  {/* Axis labels */}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs text-text-tertiary">
                      <span>Baixa Freq.</span>
                      <span>Alta Freq.</span>
                    </div>
                    <div className="flex justify-center">
                      <div className="transform -rotate-90 text-xs text-text-tertiary">
                        <span className="block">Pouca Info</span>
                        <span className="block mt-8">Muita Info</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                    <p className="text-sm font-medium text-primary">
                      {getQuadrantLabel()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-12">
            <Button
              variant="secondary"
              onClick={previousStep}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            <Button
              disabled={!canProceed}
              onClick={nextStep}
              className="flex items-center gap-2 bg-gradient-primary text-white"
            >
              Refinar com Camadas
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}