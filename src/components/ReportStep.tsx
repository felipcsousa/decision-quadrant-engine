import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { 
  getQuadrantInfo, 
  getBasePatterns, 
  getDetailedPatterns,
  refineByLayers, 
  getGuardrails, 
  generateChecklist,
  getLayerDetails,
  getTransversalRecommendations
} from '@/lib/ux-logic';
import { generateAISuggestions } from '@/lib/ai-suggestions';
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
  Shield,
  Sparkles,
  Brain,
  ChevronDown,
  ChevronRight,
  Loader2,
  User,
  Settings
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import React from 'react';

export function ReportStep() {
  const { state, previousStep, reset, aiSuggestionsGenerated, generateAISuggestions } = useAnalysis();
  const [isGeneratingAI, setIsGeneratingAI] = React.useState(false);
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    patterns: true,
    guardrails: true,
    checklist: true
  });

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
  const detailedPatterns = getDetailedPatterns(state.quadrant);
  const refinementResult = refineByLayers(basePatterns, state.layers);
  const guardrails = getGuardrails(state.quadrant, state.layers);
  const checklist = generateChecklist();
  const layerDetails = getLayerDetails();
  const transversalRecommendations = getTransversalRecommendations();
  const aiSuggestions = React.useMemo(() => 
    aiSuggestionsGenerated ? [
      { title: "Sugestão Personalizada 1", description: "Baseada no seu contexto específico", priority: "essential", rationale: "Analisando sua tarefa e configurações" },
      { title: "Sugestão Personalizada 2", description: "Otimizada para seu quadrante", priority: "high", rationale: "Considerando suas camadas de decisão" }
    ] : [], 
    [aiSuggestionsGenerated]
  );

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    await generateAISuggestions();
    setIsGeneratingAI(false);
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const basePatternList = refinementResult.patterns.filter(p => p.category === 'base');
  const refinementList = refinementResult.patterns.filter(p => p.category === 'refinement');
  const warnings = refinementResult.warnings;

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
            {/* Dados do Projeto */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl text-text-primary">Dados do Projeto</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-text-primary text-lg mb-2">{state.definition.name}</h3>
                      <p className="text-text-secondary mb-3">{state.definition.description}</p>
                    </div>
                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-medium text-primary mb-2">Job to Be Done</h4>
                      <p className="text-sm text-text-secondary">{state.definition.jtbd}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-text-primary">Frequência</Label>
                        <Badge variant="outline" className="ml-2">{state.diagnostic.frequency}/5</Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-text-primary">Informação</Label>
                        <Badge variant="outline" className="ml-2">{state.diagnostic.information}/5</Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-muted rounded">
                        <p className="text-xs font-medium text-text-primary">Risco</p>
                        <Badge variant="secondary" className="text-xs">{state.layers.risk}</Badge>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <p className="text-xs font-medium text-text-primary">Incerteza</p>
                        <Badge variant="secondary" className="text-xs">{state.layers.uncertainty}</Badge>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <p className="text-xs font-medium text-text-primary">Urgência</p>
                        <Badge variant="secondary" className="text-xs">{state.layers.urgency}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {(state.diagnostic.frequencyEvidence || state.diagnostic.informationEvidence) && (
                  <div className="space-y-2 pt-4 border-t border-border">
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

            {/* Classificação */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl text-text-primary">Classificação</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
                  <div className={`w-6 h-6 rounded-full bg-${state.quadrant.toLowerCase()}`} />
                  <div>
                    <h3 className="font-bold text-text-primary text-lg">
                      {state.quadrant} - {quadrantInfo.name}
                    </h3>
                    <p className="text-text-secondary">{quadrantInfo.archetype}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sugestões Personalizadas por IA */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-text-primary flex items-center gap-2">
                      Sugestões Personalizadas por IA
                      <Brain className="w-4 h-4 text-primary" />
                    </CardTitle>
                    <p className="text-sm text-text-secondary mt-1">
                      Recomendações específicas baseadas no contexto da sua tarefa
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {!aiSuggestionsGenerated ? (
                  <div className="text-center py-8">
                    <div className="max-w-md mx-auto">
                      <Brain className="w-16 h-16 text-primary/60 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-text-primary mb-2">
                        Gere suas sugestões personalizadas
                      </h3>
                      <p className="text-text-secondary mb-6">
                        Nossa IA analisará seu contexto específico e gerará recomendações
                        sob medida para sua tarefa.
                      </p>
                      <Button 
                        onClick={handleGenerateAI} 
                        disabled={isGeneratingAI}
                        className="flex items-center gap-2"
                      >
                        {isGeneratingAI ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Analisando seu contexto...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            Gerar Sugestões com IA
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiSuggestions.map((suggestion, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-text-primary text-sm">{suggestion.title}</h4>
                          <Badge 
                            variant={suggestion.priority === 'essential' ? 'default' : 'secondary'}
                            className="text-xs shrink-0 ml-2"
                          >
                            {suggestion.priority === 'essential' ? 'Essencial' : 
                             suggestion.priority === 'high' ? 'Alta' : 
                             suggestion.priority === 'medium' ? 'Média' : 'Baixa'}
                          </Badge>
                        </div>
                        <p className="text-sm text-text-secondary mb-2">{suggestion.description}</p>
                        <div className="text-xs text-text-tertiary p-2 bg-muted/50 rounded">
                          <strong>Por quê:</strong> {suggestion.rationale}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Warnings */}
            {warnings.length > 0 && (
              <Card className="border-warning bg-warning-bg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    <CardTitle className="text-xl text-warning">Atenção</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {warnings.map((warning, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-warning">•</span>
                        <p className="text-sm text-text-secondary">{warning}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Padrões Recomendados */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between w-full cursor-pointer hover:bg-muted/20 -m-6 p-6 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <Lightbulb className="w-5 h-5 text-primary" />
                        <CardTitle className="text-xl text-text-primary">Padrões Recomendados</CardTitle>
                      </div>
                      {openSections.patterns ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-6">
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <h3 className="font-semibold text-primary mb-2">Objetivo Cognitivo</h3>
                        <p className="text-text-secondary">{detailedPatterns.objetivo}</p>
                      </div>

                      {detailedPatterns.sections.map((section: any, index: number) => (
                        <div key={index}>
                          <h4 className="font-semibold text-text-primary mb-3">{section.title}</h4>
                          <div className="space-y-2">
                            {section.items.map((item: string, itemIndex: number) => (
                              <div key={itemIndex} className="flex items-start gap-3 p-3 bg-surface-hover rounded-lg border border-border">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                                <p className="text-sm text-text-secondary">{item}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {detailedPatterns.antiPatterns && (
                        <div>
                          <h4 className="font-semibold text-destructive mb-3">Anti-padrões</h4>
                          <div className="space-y-2">
                            {detailedPatterns.antiPatterns.map((pattern: string, index: number) => (
                              <div key={index} className="flex items-start gap-3 p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                                <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-text-secondary">{pattern}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {refinementList.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-text-primary mb-3">Refinamentos por Camadas</h4>
                          <div className="space-y-3">
                            {refinementList.map((pattern, index) => (
                              <div key={index} className="flex items-start gap-3 p-4 bg-accent/5 border border-accent/20 rounded-lg">
                                <div className={`w-2 h-2 rounded-full mt-2 ${
                                  pattern.priority === 'high' ? 'bg-destructive' : 
                                  pattern.priority === 'medium' ? 'bg-warning' : 'bg-info'
                                }`} />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-medium text-text-primary">{pattern.name}</h5>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      pattern.priority === 'high' ? 'bg-destructive/10 text-destructive' :
                                      pattern.priority === 'medium' ? 'bg-warning-bg text-warning' : 'bg-info-bg text-info'
                                    }`}>
                                      {pattern.priority === 'high' ? 'Alta' : pattern.priority === 'medium' ? 'Média' : 'Baixa'}
                                    </span>
                                  </div>
                                  <p className="text-sm text-text-secondary">{pattern.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </CardHeader>
            </Card>

            {/* Guardrails/KPIs */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between w-full cursor-pointer hover:bg-muted/20 -m-6 p-6 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-primary" />
                        <CardTitle className="text-xl text-text-primary">Guardrails/KPIs</CardTitle>
                      </div>
                      {openSections.guardrails ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold text-text-primary">KPIs do Quadrante</h4>
                        {guardrails.map((guardrail, index) => (
                          <div key={index} className="border-l-4 border-primary pl-4 bg-surface-hover p-4 rounded-r-lg">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-text-primary">{guardrail.metric}</h4>
                              <Badge variant="secondary" className="shrink-0 ml-2">{guardrail.target}</Badge>
                            </div>
                            {guardrail.range && (
                              <div className="text-xs text-text-tertiary mb-1">
                                Faixa aceitável: {guardrail.range}
                              </div>
                            )}
                            <p className="text-sm text-text-secondary">{guardrail.description}</p>
                          </div>
                        ))}
                      </div>

                      {/* Layer Details */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-text-primary">Orientações por Camada</h4>
                        
                        {/* Risk */}
                        <div>
                          <h5 className="font-medium text-text-primary mb-2">Risco ({state.layers.risk})</h5>
                          <div className="p-4 bg-muted rounded-lg space-y-2">
                            <div><strong>UX:</strong> {layerDetails.risk[state.layers.risk]?.ux}</div>
                            <div><strong>Validação:</strong> {layerDetails.risk[state.layers.risk]?.validation}</div>
                            <div><strong>Copy:</strong> {layerDetails.risk[state.layers.risk]?.copy}</div>
                            {layerDetails.risk[state.layers.risk]?.measurement && (
                              <div><strong>Medição:</strong> {layerDetails.risk[state.layers.risk].measurement}</div>
                            )}
                          </div>
                        </div>

                        {/* Uncertainty */}
                        <div>
                          <h5 className="font-medium text-text-primary mb-2">Incerteza ({state.layers.uncertainty})</h5>
                          <div className="p-4 bg-muted rounded-lg space-y-2">
                            <div><strong>UX:</strong> {layerDetails.uncertainty[state.layers.uncertainty]?.ux}</div>
                            <div><strong>Validação:</strong> {layerDetails.uncertainty[state.layers.uncertainty]?.validation}</div>
                            <div><strong>Copy:</strong> {layerDetails.uncertainty[state.layers.uncertainty]?.copy}</div>
                          </div>
                        </div>

                        {/* Urgency */}
                        <div>
                          <h5 className="font-medium text-text-primary mb-2">Urgência ({state.layers.urgency})</h5>
                          <div className="p-4 bg-muted rounded-lg space-y-2">
                            <div><strong>UX:</strong> {layerDetails.urgency[state.layers.urgency]?.ux}</div>
                            <div><strong>Validação:</strong> {layerDetails.urgency[state.layers.urgency]?.validation}</div>
                            <div><strong>Copy:</strong> {layerDetails.urgency[state.layers.urgency]?.copy}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </CardHeader>
            </Card>

            {/* Checklist de Implementação */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <Collapsible>
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between w-full cursor-pointer hover:bg-muted/20 -m-6 p-6 rounded-lg transition-colors">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <CardTitle className="text-xl text-text-primary">Checklist de Implementação</CardTitle>
                      </div>
                      {openSections.checklist ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-6">
                      {/* Checklist específico do quadrante */}
                      <div>
                        <h4 className="font-semibold text-text-primary mb-3">Checklist {state.quadrant}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {detailedPatterns.checklistItems.map((item: string, index: number) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                              <Clock className="w-4 h-4 text-text-tertiary mt-0.5 flex-shrink-0" />
                              <p className="font-medium text-text-primary text-sm">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Regra dos 4 */}
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

                      {/* Estados Essenciais */}
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

                      <Separator />

                      {/* Recomendações Transversais */}
                      <div>
                        <h4 className="font-semibold text-text-primary mb-3">Recomendações Transversais</h4>
                        <div className="space-y-3">
                          {transversalRecommendations.map((recommendation, index) => (
                            <div key={index} className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                              <p className="text-sm text-text-secondary">{recommendation}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </CardHeader>
            </Card>

            {/* Próximos Passos */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl text-text-primary">Próximos Passos</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-text-secondary">
                  <li>• Definir responsáveis pela implementação dos padrões identificados</li>
                  <li>• Estabelecer cronograma para desenvolvimento baseado nas prioridades</li>
                  <li>• Configurar monitoramento dos KPIs recomendados</li>
                  <li>• Agendar validações de usabilidade após implementação</li>
                  <li>• Documentar decisões de design para consulta futura</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-12">
            <Button variant="outline" onClick={previousStep} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar às Camadas
            </Button>
            <Button onClick={reset} variant="secondary">
              Nova Análise
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}