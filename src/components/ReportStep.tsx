import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { supabase } from '@/integrations/supabase/client';
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
  Link as LinkIcon, 
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
  Settings,
  Home,
  Printer,
  RefreshCw,
  RotateCcw,
  ArrowRight,
  Layers,
  CheckSquare
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import React from 'react';

export function ReportStep() {
  const { state, goToStep, reset, aiSuggestionsGenerated, generateAISuggestions, saveAnalysis } = useAnalysis();
  const [isGeneratingAI, setIsGeneratingAI] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [backendData, setBackendData] = React.useState<any>(null);
  const [sectionsOpen, setSectionsOpen] = React.useState<Record<string, boolean>>({
    patterns: true,
    guardrails: false,
    checklist: false
  });

  // Try to fetch recommendations from backend
  React.useEffect(() => {
    if (state.quadrant) {
      fetchRecommendations();
    }
  }, [state.quadrant, state.layers]);

  const fetchRecommendations = async () => {
    try {
      console.log('Fetching recommendations from backend...');
      const { data, error } = await supabase.functions.invoke('get-recommendations', {
        body: {
          quadrant: state.quadrant,
          layers: state.layers
        }
      });

      if (error) throw error;
      console.log('Backend data loaded successfully');
      setBackendData(data);
    } catch (error) {
      console.warn('Backend unavailable, using local data:', error);
      // Will use local functions as fallback
    }
  };

  if (!state.quadrant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-text-secondary">Erro: Dados da análise não encontrados</p>
          <Button onClick={() => goToStep(0)} className="mt-4">
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  // Use backend data if available, otherwise use local functions
  const quadrantInfo = backendData?.quadrantInfo || getQuadrantInfo(state.quadrant);
  const basePatterns = backendData?.basePatterns || getBasePatterns(state.quadrant);
  const detailedPatterns = backendData?.detailedSections || getDetailedPatterns(state.quadrant);
  const guardrails = backendData?.guardrails || getGuardrails(state.quadrant, state.layers);
  const checklist = backendData?.checklist || generateChecklist();
  const transversalRecommendations = backendData?.transversalRecommendations || getTransversalRecommendations();

  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    await generateAISuggestions();
    setIsGeneratingAI(false);
  };

  const handleSaveAnalysis = async () => {
    setIsSaving(true);
    await saveAnalysis(true);
    setIsSaving(false);
  };

  const toggleSection = (section: string, open?: boolean) => {
    setSectionsOpen(prev => ({ 
      ...prev, 
      [section]: open !== undefined ? open : !prev[section] 
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const layers = [
    `Risco: ${state.layers.risk}`,
    `Incerteza: ${state.layers.uncertainty}`,
    `Urgência: ${state.layers.urgency}`
  ];

  const evidence = [
    state.diagnostic.frequencyEvidence,
    state.diagnostic.informationEvidence
  ].filter(Boolean);

  const getQuadrantColor = (quadrant: string) => {
    const colors: Record<string, string> = {
      'Q1': 'bg-q1',
      'Q2': 'bg-q2', 
      'Q3': 'bg-q3',
      'Q4': 'bg-q4'
    };
    return colors[quadrant] || 'bg-muted';
  };

  const getQuadrantBg = (quadrant: string) => {
    const colors: Record<string, string> = {
      'Q1': 'bg-q1-bg border-q1/20',
      'Q2': 'bg-q2-bg border-q2/20',
      'Q3': 'bg-q3-bg border-q3/20', 
      'Q4': 'bg-q4-bg border-q4/20'
    };
    return colors[quadrant] || 'bg-muted border-border';
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 px-4 pb-8">
      {/* Navigation */}
      <div className="flex items-center gap-2 text-sm text-text-secondary">
        <Home className="h-4 w-4" />
        <span>Dashboard</span>
        <ChevronRight className="h-4 w-4" />
        <span>Análise UX</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-text-primary font-medium">Relatório</span>
      </div>

      {/* Page Header */}
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Relatório de Análise UX</h1>
          <p className="text-text-secondary text-lg">
            Análise detalhada baseada na metodologia 2x2 de UX
          </p>
        </div>
        <div className="flex gap-3 no-print shrink-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopyLink}
            className="gap-2 hover:bg-surface-hover transition-colors"
          >
            <LinkIcon className="h-4 w-4" />
            Copiar Link
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            className="gap-2 hover:bg-surface-hover transition-colors"
          >
            <Printer className="h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* 1. Dados do Projeto */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-6 border-b border-border/50">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold text-text-primary">
            <div className="p-2 bg-primary/5 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            Dados do Projeto
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-1">
              <h4 className="font-medium text-sm text-text-secondary uppercase tracking-wider">Nome do Projeto</h4>
              <p className="font-semibold text-lg text-text-primary">{state.definition.name}</p>
            </div>
            
            <div className="space-y-1">
              <h4 className="font-medium text-sm text-text-secondary uppercase tracking-wider">Job to be Done</h4>
              <p className="text-text-primary leading-relaxed">{state.definition.jtbd}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-text-secondary uppercase tracking-wider">Descrição</h4>
            <p className="text-text-primary leading-relaxed bg-surface-sunken p-4 rounded-lg">
              {state.definition.description}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm text-text-secondary uppercase tracking-wider">Camadas Selecionadas</h4>
            <div className="flex flex-wrap gap-2">
              {layers.map((layer, index) => (
                <Badge key={index} variant="secondary" className="text-xs font-medium px-3 py-1">
                  {layer}
                </Badge>
              ))}
            </div>
          </div>

          {evidence && evidence.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-text-secondary uppercase tracking-wider">Evidências do Diagnóstico</h4>
              <div className="space-y-3">
                {evidence.map((item, index) => (
                  <div key={index} className="bg-info-bg border border-info/20 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="p-1 bg-info/20 rounded">
                        <CheckCircle className="h-4 w-4 text-info" />
                      </div>
                      <p className="text-sm text-text-primary leading-relaxed">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Classificação */}
      <Card className="shadow-sm border-border/50">
        <CardHeader className="pb-6 border-b border-border/50">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold text-text-primary">
            <div className="p-2 bg-primary/5 rounded-lg">
              <Target className="h-5 w-5 text-primary" />
            </div>
            Classificação
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl border-2 ${getQuadrantBg(state.quadrant)} transition-all hover:shadow-md`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-4 h-4 rounded-full ${getQuadrantColor(state.quadrant)}`}></div>
                <h3 className="font-bold text-lg text-text-primary">{quadrantInfo.name}</h3>
              </div>
              <p className="text-text-secondary leading-relaxed">{quadrantInfo.description}</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-surface-sunken p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-text-secondary">Frequência de Uso</span>
                  <Badge variant="outline" className="text-xs font-medium px-3 py-1">
                    {state.diagnostic.frequency}
                  </Badge>
                </div>
              </div>
              <div className="bg-surface-sunken p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-text-secondary">Complexidade de Informação</span>
                  <Badge variant="outline" className="text-xs font-medium px-3 py-1">
                    {state.diagnostic.information}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Sugestões Personalizadas por IA */}
      <Card className="shadow-sm border-border/50 bg-gradient-to-br from-card to-surface-elevated">
        <CardHeader className="pb-6 border-b border-border/50">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold text-text-primary">
            <div className="p-2 bg-primary/5 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            Sugestões Personalizadas por IA
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {!aiSuggestionsGenerated ? (
            <div className="text-center py-12 space-y-6">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg text-text-primary">Gerar Análise Personalizada</h3>
                <p className="text-text-secondary leading-relaxed max-w-md mx-auto">
                  Nossa IA analisará o contexto específico do seu projeto e gerará recomendações 
                  personalizadas baseadas nas melhores práticas de UX
                </p>
                <Button 
                  onClick={handleGenerateAI} 
                  disabled={isGeneratingAI}
                  className="gap-2 mt-4 px-6 py-2"
                  size="lg"
                >
                  {isGeneratingAI ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Analisando contexto...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Gerar Sugestões com IA
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-surface-sunken p-6 rounded-lg border border-border/50">
                <div className="prose prose-sm max-w-none">
                  <p className="text-text-primary leading-relaxed">
                    Sugestões personalizadas foram geradas com base no contexto do seu projeto. 
                    Esta funcionalidade está em desenvolvimento e em breve fornecerá análises detalhadas.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-border/50">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleGenerateAI}
                  disabled={isGeneratingAI}
                  className="gap-2 hover:bg-surface-hover transition-colors"
                >
                  {isGeneratingAI ? (
                    <>
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Regenerando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3" />
                      Regenerar Sugestões
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Padrões Recomendados */}
      <Card className="shadow-sm border-border/50">
        <Collapsible 
          open={sectionsOpen.patterns} 
          onOpenChange={(open) => toggleSection('patterns', open)}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-6 cursor-pointer hover:bg-surface-hover transition-all duration-200 border-b border-border/50">
              <CardTitle className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/5 rounded-lg group-hover:bg-primary/10 transition-colors">
                    <Layers className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xl font-semibold text-text-primary">Padrões Recomendados</span>
                </div>
                <ChevronDown className={`h-5 w-5 text-text-secondary transition-all duration-200 ${sectionsOpen.patterns ? 'rotate-180' : ''}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
            <CardContent className="p-6 space-y-8">
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-text-primary border-b border-border/30 pb-2">
                  Padrões Base
                </h3>
                <div className="grid gap-4">
                  {basePatterns.map((pattern, patternIndex) => (
                      <div key={patternIndex} className="bg-surface-sunken border border-border/30 p-5 rounded-lg hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-text-primary">{pattern.name}</h4>
                          <Badge 
                            variant={pattern.priority === 'essential' ? 'default' : pattern.priority === 'high' ? 'secondary' : 'outline'} 
                            className="text-xs shrink-0 ml-3"
                          >
                            {pattern.priority === 'essential' ? 'Essencial' : 
                             pattern.priority === 'high' ? 'Alta' : 
                             pattern.priority === 'medium' ? 'Média' : 'Baixa'}
                          </Badge>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {pattern.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* 5. Guardrails e KPIs */}
      <Card className="shadow-sm border-border/50">
        <Collapsible 
          open={sectionsOpen.guardrails} 
          onOpenChange={(open) => toggleSection('guardrails', open)}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-6 cursor-pointer hover:bg-surface-hover transition-all duration-200 border-b border-border/50">
              <CardTitle className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/10 rounded-lg group-hover:bg-warning/20 transition-colors">
                    <Shield className="h-5 w-5 text-warning" />
                  </div>
                  <span className="text-xl font-semibold text-text-primary">Guardrails e KPIs</span>
                </div>
                <ChevronDown className={`h-5 w-5 text-text-secondary transition-all duration-200 ${sectionsOpen.guardrails ? 'rotate-180' : ''}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
            <CardContent className="p-6 space-y-6">
              {guardrails.map((guardrail, index) => (
                <div key={index} className="bg-warning-bg border border-warning/20 p-5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-warning/20 rounded shrink-0 mt-0.5">
                      <Shield className="h-4 w-4 text-warning" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-text-primary">{guardrail.metric}</h4>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {guardrail.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* 6. Checklist de Implementação */}
      <Card className="shadow-sm border-border/50">
        <Collapsible 
          open={sectionsOpen.checklist} 
          onOpenChange={(open) => toggleSection('checklist', open)}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="pb-6 cursor-pointer hover:bg-surface-hover transition-all duration-200 border-b border-border/50">
              <CardTitle className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-lg group-hover:bg-success/20 transition-colors">
                    <CheckSquare className="h-5 w-5 text-success" />
                  </div>
                  <span className="text-xl font-semibold text-text-primary">Checklist de Implementação</span>
                </div>
                <ChevronDown className={`h-5 w-5 text-text-secondary transition-all duration-200 ${sectionsOpen.checklist ? 'rotate-180' : ''}`} />
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden">
            <CardContent className="p-6 space-y-8">
              {checklist.map((checklistItem, itemIndex) => (
                <div key={itemIndex} className="space-y-4">
                  <h4 className="font-bold text-lg text-text-primary border-b border-border/30 pb-2">
                    {checklistItem.category}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-surface-sunken rounded-lg hover:bg-surface-hover transition-colors">
                      <div className="w-5 h-5 border-2 border-success/40 rounded-md mt-0.5 flex-shrink-0 hover:border-success transition-colors cursor-pointer"></div>
                      <div className="space-y-1">
                        <span className="text-sm text-text-primary leading-relaxed font-medium">{checklistItem.item}</span>
                        {checklistItem.description && (
                          <p className="text-xs text-text-secondary">{checklistItem.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* 7. Próximos Passos */}
      <Card className="shadow-sm border-border/50 bg-gradient-to-br from-card to-surface-elevated">
        <CardHeader className="pb-6 border-b border-border/50">
          <CardTitle className="flex items-center gap-3 text-xl font-semibold text-text-primary">
            <div className="p-2 bg-primary/5 rounded-lg">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
            Próximos Passos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button 
              onClick={() => goToStep(2)} 
              variant="outline" 
              className="h-12 gap-3 hover:bg-surface-hover transition-colors"
              size="lg"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Camadas
            </Button>
            <Button 
              onClick={handleSaveAnalysis}
              disabled={isSaving}
              variant="outline"
              className="h-12 gap-3"
              size="lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  Salvar Análise
                </>
              )}
            </Button>
            <Button 
              onClick={() => reset()} 
              className="h-12 gap-3"
              size="lg"
            >
              <RotateCcw className="h-4 w-4" />
              Nova Análise
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}