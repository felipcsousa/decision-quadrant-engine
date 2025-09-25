import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { 
  getQuadrantInfo, 
  getBasePatterns, 
  refineByLayers, 
  getGuardrails, 
  generateChecklist 
} from '@/lib/ux-logic';
import { 
  ArrowLeft, 
  Download, 
  Link, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  FileText,
  Target,
  Lightbulb,
  Shield
} from 'lucide-react';

export function ReportStep() {
  const { state, previousStep, reset } = useAnalysis();

  if (!state.quadrant) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary">Erro: Quadrante não identificado</p>
          <Button onClick={previousStep} className="mt-4">
            Voltar ao diagnóstico
          </Button>
        </div>
      </div>
    );
  }

  const quadrantInfo = getQuadrantInfo(state.quadrant);
  const basePatterns = getBasePatterns(state.quadrant);
  const refinedPatterns = refineByLayers(basePatterns, state.layers);
  const guardrails = getGuardrails(state.quadrant, state.layers);
  const checklist = generateChecklist();

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    // In a real app, this would generate a shareable link with state
    navigator.clipboard.writeText(window.location.href);
  };

  const basePatternList = refinedPatterns.filter(p => p.category === 'base');
  const refinementList = refinedPatterns.filter(p => p.category === 'refinement');

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-text-primary mb-4">
              Relatório de Análise UX
            </h1>
            <p className="text-lg text-text-secondary">
              Recomendações personalizadas baseadas na metodologia 2×2
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar PDF
            </Button>
            <Button variant="secondary" onClick={handleCopyLink} className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              Copiar Link
            </Button>
          </div>

          <div className="space-y-8" id="report-content">
            {/* Metadados */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl text-text-primary">Metadados</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">{state.definition.name}</h3>
                  <p className="text-text-secondary mb-3">{state.definition.description}</p>
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <h4 className="font-medium text-accent-foreground mb-1">Job to Be Done</h4>
                    <p className="text-sm text-text-secondary">{state.definition.jtbd}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Classificação */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl text-text-primary">Classificação</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
                  <div className={`w-6 h-6 rounded-full bg-${state.quadrant.toLowerCase()}`} />
                  <div>
                    <h3 className="font-bold text-text-primary text-lg">
                      {state.quadrant} - {quadrantInfo.name}
                    </h3>
                    <p className="text-text-secondary">{quadrantInfo.archetype}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-text-primary">Frequência</Label>
                    <Badge variant="outline" className="ml-2">{state.diagnostic.frequency}/5</Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-text-primary">Informação</Label>
                    <Badge variant="outline" className="ml-2">{state.diagnostic.information}/5</Badge>
                  </div>
                </div>

                {(state.diagnostic.frequencyEvidence || state.diagnostic.informationEvidence) && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-text-primary">Evidências</h4>
                    {state.diagnostic.frequencyEvidence && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium text-text-primary">Frequência:</p>
                        <p className="text-sm text-text-secondary">{state.diagnostic.frequencyEvidence}</p>
                      </div>
                    )}
                    {state.diagnostic.informationEvidence && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium text-text-primary">Informação:</p>
                        <p className="text-sm text-text-secondary">{state.diagnostic.informationEvidence}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Padrões */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl text-text-primary">Padrões Recomendados</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h3 className="font-semibold text-primary mb-2">Diretriz Principal</h3>
                  <p className="text-text-secondary">{quadrantInfo.guideline}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-text-primary mb-3">Padrões Base ({state.quadrant})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {basePatternList.map((pattern, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg">
                        <h5 className="font-medium text-text-primary">{pattern.name}</h5>
                        <p className="text-sm text-text-secondary">{pattern.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {refinementList.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Refinamentos por Camadas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {refinementList.map((pattern, index) => (
                        <div key={index} className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                          <h5 className="font-medium text-accent-foreground">{pattern.name}</h5>
                          <p className="text-sm text-text-secondary">{pattern.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Guardrails */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl text-text-primary">Guardrails/KPIs</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guardrails.map((guardrail, index) => (
                    <div key={index} className="p-4 bg-surface-elevated border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-text-primary">{guardrail.metric}</h4>
                        <Badge variant="secondary">{guardrail.target}</Badge>
                      </div>
                      <p className="text-sm text-text-secondary">{guardrail.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Checklist */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl text-text-primary">Checklist de Implementação</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Regra dos 4</h4>
                    <div className="space-y-2">
                      {checklist.filter(item => item.category === 'regra_dos_4').map((item, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                          <Clock className="w-4 h-4 text-text-tertiary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-text-primary">{item.item}</p>
                            {item.description && (
                              <p className="text-sm text-text-secondary">{item.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-text-primary mb-3">Estados Essenciais</h4>
                    <div className="space-y-2">
                      {checklist.filter(item => item.category === 'estados').map((item, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                          <Clock className="w-4 h-4 text-text-tertiary mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-text-primary">{item.item}</p>
                            {item.description && (
                              <p className="text-sm text-text-secondary">{item.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Próximos Passos */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl text-text-primary">Próximos Passos</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-text-secondary">
                  <li>• Validar recomendações com a equipe de design</li>
                  <li>• Criar wireframes/protótipos baseados nos padrões</li>
                  <li>• Definir critérios de aceite técnicos</li>
                  <li>• Estabelecer métricas de sucesso baseadas nos guardrails</li>
                  <li>• Agendar testes de usabilidade se necessário</li>
                </ul>
              </CardContent>
            </Card>
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
              onClick={reset}
              variant="outline"
              className="flex items-center gap-2"
            >
              Nova Análise
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}