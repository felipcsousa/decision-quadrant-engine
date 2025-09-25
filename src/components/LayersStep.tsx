import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { ArrowLeft, ArrowRight, Shield, HelpCircle, Clock, Users } from 'lucide-react';
import { RiskLevel, UncertaintyLevel, UrgencyLevel, CollaborationLevel } from '@/types/ux-analysis';

interface LayerSelectProps {
  label: string;
  description: string;
  icon: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  options: { value: string; label: string; description: string }[];
}

function LayerSelect({ label, description, icon, value, onValueChange, options }: LayerSelectProps) {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg text-text-primary">{label}</CardTitle>
            <p className="text-sm text-text-secondary">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label className="text-sm font-medium text-text-primary">Nível</Label>
          <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="border-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-text-secondary">{option.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

export function LayersStep() {
  const { state, updateLayers, nextStep, previousStep } = useAnalysis();

  const riskOptions = [
    { value: 'baixo', label: 'Baixo', description: 'Impacto limitado de erros' },
    { value: 'médio', label: 'Médio', description: 'Consequências moderadas' },
    { value: 'alto', label: 'Alto', description: 'Impacto crítico ou financeiro' }
  ];

  const uncertaintyOptions = [
    { value: 'baixa', label: 'Baixa', description: 'Processo bem conhecido' },
    { value: 'média', label: 'Média', description: 'Algumas variáveis desconhecidas' },
    { value: 'alta', label: 'Alta', description: 'Muitas incertezas ou primeira vez' }
  ];

  const urgencyOptions = [
    { value: 'baixa', label: 'Baixa', description: 'Pode ser feito quando conveniente' },
    { value: 'média', label: 'Média', description: 'Prazo flexível mas definido' },
    { value: 'alta', label: 'Alta', description: 'Necessário imediatamente' }
  ];

  const collaborationOptions = [
    { value: 'solo', label: 'Individual', description: 'Uma pessoa executa sozinha' },
    { value: 'multi', label: 'Colaborativo', description: 'Múltiplas pessoas envolvidas' }
  ];

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-text-primary mb-4">
              Camadas de Decisão
            </h1>
            <p className="text-lg text-text-secondary">
              Refine a análise com fatores contextuais que influenciam o design
            </p>
          </div>

          {/* Current Quadrant Display */}
          {state.quadrant && (
            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full bg-${state.quadrant.toLowerCase()}`} />
                  <div>
                    <h3 className="font-semibold text-text-primary">
                      Quadrante {state.quadrant} identificado
                    </h3>
                    <p className="text-sm text-text-secondary">
                      As camadas abaixo irão refinar os padrões base deste quadrante
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Layer Selects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <LayerSelect
              label="Risco"
              description="Impacto de erros ou falhas"
              icon={<Shield className="w-5 h-5 text-primary" />}
              value={state.layers.risk}
              onValueChange={(value) => updateLayers({ risk: value as RiskLevel })}
              options={riskOptions}
            />

            <LayerSelect
              label="Incerteza"
              description="Conhecimento do usuário sobre o processo"
              icon={<HelpCircle className="w-5 h-5 text-primary" />}
              value={state.layers.uncertainty}
              onValueChange={(value) => updateLayers({ uncertainty: value as UncertaintyLevel })}
              options={uncertaintyOptions}
            />

            <LayerSelect
              label="Urgência"
              description="Pressão temporal para completar"
              icon={<Clock className="w-5 h-5 text-primary" />}
              value={state.layers.urgency}
              onValueChange={(value) => updateLayers({ urgency: value as UrgencyLevel })}
              options={urgencyOptions}
            />

            <LayerSelect
              label="Colaboração"
              description="Número de pessoas envolvidas (opcional)"
              icon={<Users className="w-5 h-5 text-primary" />}
              value={state.layers.collaboration || 'solo'}
              onValueChange={(value) => updateLayers({ collaboration: value as CollaborationLevel })}
              options={collaborationOptions}
            />
          </div>

          {/* Impact Preview */}
          <Card className="mb-8 border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-text-primary">
                Refinamentos que serão aplicados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {state.layers.risk === 'alto' && (
                  <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <h4 className="font-medium text-destructive mb-1">Risco Alto</h4>
                    <ul className="text-sm text-text-secondary space-y-1">
                      <li>• Confirmação explícita</li>
                      <li>• Autenticação reforçada</li>
                      <li>• Destaque de consequências</li>
                    </ul>
                  </div>
                )}
                
                {state.layers.uncertainty === 'alta' && (
                  <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
                    <h4 className="font-medium text-accent-foreground mb-1">Incerteza Alta</h4>
                    <ul className="text-sm text-text-secondary space-y-1">
                      <li>• Ajuda contextual</li>
                      <li>• Histórico/referências</li>
                      <li>• Mini-simulação</li>
                    </ul>
                  </div>
                )}
                
                {state.layers.urgency === 'alta' && (
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <h4 className="font-medium text-primary mb-1">Urgência Alta</h4>
                    <ul className="text-sm text-text-secondary space-y-1">
                      <li>• Encontrabilidade ≤2s</li>
                      <li>• CTA sempre visível</li>
                      <li>• Feedback imediato</li>
                    </ul>
                  </div>
                )}
              </div>
              
              {state.layers.risk === 'baixo' && state.layers.uncertainty === 'baixa' && state.layers.urgency === 'baixa' && (
                <p className="text-sm text-text-secondary italic">
                  Nenhum refinamento especial será aplicado. Os padrões base do quadrante serão mantidos.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="secondary"
              onClick={previousStep}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            <Button
              onClick={nextStep}
              className="flex items-center gap-2 bg-gradient-primary text-white"
            >
              Gerar Relatório
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}