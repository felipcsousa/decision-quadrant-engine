import { 
  Likert, 
  Level3Dir, 
  AxisLevel, 
  Quadrant, 
  DiagnosticData,
  DecisionLayers,
  Pattern,
  Guardrail,
  ChecklistItem,
  AnalysisReport,
  NudgePreset
} from '@/types/ux-analysis';

export function mapAxis(value: Likert, dirIf3?: Level3Dir): AxisLevel {
  if (value <= 2) return 'baixo';
  if (value >= 4) return 'alto';
  return dirIf3 ?? 'indefinido';
}

export function classifyQuadrant(
  freq: Likert, 
  info: Likert, 
  dirFreq3?: Level3Dir, 
  dirInfo3?: Level3Dir
): { quadrant: Quadrant | null; needsEvidence: boolean } {
  const f = mapAxis(freq, dirFreq3);
  const i = mapAxis(info, dirInfo3);
  
  if (f === 'indefinido' || i === 'indefinido') {
    return { quadrant: null, needsEvidence: true };
  }
  
  if (f === 'alto' && i === 'baixo') return { quadrant: 'Q1', needsEvidence: false };
  if (f === 'alto' && i === 'alto') return { quadrant: 'Q2', needsEvidence: false };
  if (f === 'baixo' && i === 'baixo') return { quadrant: 'Q3', needsEvidence: false };
  return { quadrant: 'Q4', needsEvidence: false };
}

export function getQuadrantInfo(quadrant: Quadrant) {
  const info = {
    Q1: {
      name: 'Rotina',
      archetype: 'Ações frequentes e diretas',
      guideline: 'Otimização para velocidade e eficiência',
      description: 'Tarefas rotineiras que o usuário executa frequentemente com pouca necessidade de informação.'
    },
    Q2: {
      name: 'Cockpit',
      archetype: 'Análise frequente com múltiplas variáveis',
      guideline: 'Interface rica em informação e controles',
      description: 'Tarefas frequentes que requerem análise de informações complexas.'
    },
    Q3: {
      name: 'Guiado',
      archetype: 'Tarefas ocasionais e simples',
      guideline: 'Orientação clara passo a passo',
      description: 'Tarefas simples executadas ocasionalmente que precisam de orientação.'
    },
    Q4: {
      name: 'Decisão Pontual',
      archetype: 'Tarefas complexas e ocasionais',
      guideline: 'Organização e clareza com validação precoce',
      description: 'Tarefas complexas executadas ocasionalmente que exigem análise cuidadosa.'
    }
  };
  
  return info[quadrant];
}

export function getBasePatterns(quadrant: Quadrant): Pattern[] {
  const patterns = {
    Q1: [
      { name: 'Ações Rápidas', description: 'Botões principais sempre visíveis e acessíveis', category: 'base' as const },
      { name: 'Preenchimento Inteligente', description: 'Lembrar últimos valores e sugerir automaticamente', category: 'base' as const },
      { name: 'Resposta Imediata', description: 'Mostrar resultado antes da confirmação do servidor', category: 'base' as const },
      { name: 'Memória Muscular', description: 'Manter posições e gestos consistentes entre versões', category: 'base' as const }
    ],
    Q2: [
      { name: 'Visão Geral → Detalhes', description: 'Começar com resumo executivo, depois permitir drill-down', category: 'base' as const },
      { name: 'Filtros por Categoria', description: 'Organizar filtros em grupos com contadores', category: 'base' as const },
      { name: 'Busca Inteligente', description: 'Sugestões automáticas e busca por múltiplos campos', category: 'base' as const },
      { name: 'Ações em Lote', description: 'Selecionar múltiplos itens para operações simultâneas', category: 'base' as const },
      { name: 'Configurações Salvas', description: 'Permitir salvar combinações de filtros favoritas', category: 'base' as const }
    ],
    Q3: [
      { name: 'Assistente Simples', description: 'Uma decisão por tela com progresso claro', category: 'base' as const },
      { name: 'Ajuda Contextual', description: 'Dicas e exemplos próximos aos campos', category: 'base' as const },
      { name: 'Revisar e Voltar', description: 'Sempre permitir corrigir antes de finalizar', category: 'base' as const }
    ],
    Q4: [
      { name: 'Assistente Completo', description: 'Múltiplos passos com navegação livre entre eles', category: 'base' as const },
      { name: 'Salvamento Automático', description: 'Nunca perder progresso por problemas técnicos', category: 'base' as const },
      { name: 'Validação Imediata', description: 'Avisar sobre problemas assim que o campo é preenchido', category: 'base' as const },
      { name: 'Resumo Lateral', description: 'Painel fixo mostrando escolhas atuais', category: 'base' as const },
      { name: 'Navegação Flexível', description: 'Links diretos para retomar em qualquer ponto', category: 'base' as const }
    ]
  };
  
  return patterns[quadrant];
}

export function refineByLayers(basePatterns: Pattern[], layers: DecisionLayers): { patterns: Pattern[]; warnings: string[] } {
  const refinements: Pattern[] = [];
  const warnings: string[] = [];
  
  // Detect consistency issues
  if (layers.risk === 'alto' && layers.urgency === 'alta') {
    warnings.push('Alto risco + alta urgência: considere simplificar ou adicionar validações extras');
  }
  
  if (layers.uncertainty === 'alta' && layers.urgency === 'alta') {
    warnings.push('Alta incerteza + alta urgência: pode gerar decisões precipitadas');
  }
  
  // Risk refinements (priority: high)
  if (layers.risk === 'alto') {
    refinements.push(
      { name: 'Dupla Confirmação', description: 'Pedir confirmação adicional com senha ou biometria', category: 'refinement', priority: 'high' },
      { name: 'Delay de Reflexão', description: 'Aguardar 3 segundos antes de habilitar ação crítica', category: 'refinement', priority: 'high' },
      { name: 'Consequências Visíveis', description: 'Mostrar claramente o que acontecerá após a ação', category: 'refinement', priority: 'medium' }
    );
  }
  
  // Uncertainty refinements (priority: medium)
  if (layers.uncertainty === 'alta') {
    refinements.push(
      { name: 'Tutorial Interativo', description: 'Guia prático na primeira utilização', category: 'refinement', priority: 'high' },
      { name: 'Exemplos Reais', description: 'Mostrar casos similares ou histórico de decisões', category: 'refinement', priority: 'medium' },
      { name: 'Simulação em Tempo Real', description: 'Calcular impacto das escolhas conforme o usuário preenche', category: 'refinement', priority: 'low' }
    );
  }
  
  // Urgency refinements (priority: high for access, medium for feedback)
  if (layers.urgency === 'alta') {
    refinements.push(
      { name: 'Acesso em 2 Segundos', description: 'Função principal acessível em menos de 2 segundos', category: 'refinement', priority: 'high' },
      { name: 'Atalhos de Teclado', description: 'Permitir completar ação com teclas (Ctrl+Enter)', category: 'refinement', priority: 'high' },
      { name: 'Resposta Instantânea', description: 'Feedback visual em menos de 300ms', category: 'refinement', priority: 'medium' }
    );
  }
  
  // Sort patterns by priority
  const allPatterns = [...basePatterns.map(p => ({ ...p, priority: 'essential' as const })), ...refinements];
  const sortedPatterns = allPatterns.sort((a, b) => {
    const priorityOrder = { essential: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  return { patterns: sortedPatterns, warnings };
}

export function getGuardrails(quadrant: Quadrant, layers: DecisionLayers): Guardrail[] {
  const base = {
    Q1: [
      { metric: 'Toques para ação principal', target: '≤2 toques', description: 'Eficiência de acesso', range: '1-2 toques' },
      { metric: 'Tempo para conclusão', target: '≤5s', description: 'Meta de velocidade', range: '3-5s' },
      { metric: 'Taxa de sucesso', target: '≥95%', description: 'Eficácia da interface', range: '95-100%' }
    ],
    Q2: [
      { metric: 'Resposta de filtros', target: '300ms ± 100ms', description: 'Filtros reativos', range: '200-400ms' },
      { metric: 'Densidade de informação', target: '7±2 elementos por grupo', description: 'Legibilidade mantida', range: '5-9 elementos' },
      { metric: 'Tempo de scan', target: '≤15s para overview', description: 'Compreensão rápida', range: '10-15s' }
    ],
    Q3: [
      { metric: 'Decisões por tela', target: '1 decisão', description: 'Simplicidade cognitiva', range: '1 decisão' },
      { metric: 'Clareza de sucesso', target: '100% dos usuários entendem', description: 'Feedback inequívoco', range: '95-100%' },
      { metric: 'Taxa de abandono', target: '≤15%', description: 'Fluxo bem guiado', range: '5-15%' }
    ],
    Q4: [
      { metric: 'Prevenção de perda', target: 'Zero perda de dados', description: 'Progresso sempre salvo', range: '0% perda' },
      { metric: 'Validação real-time', target: '≤2s após input', description: 'Detecção precoce de erros', range: '1-2s' },
      { metric: 'Tempo de preenchimento', target: '≤20min', description: 'Processo não exaustivo', range: '15-20min' }
    ]
  };
  
  const additional: Guardrail[] = [];
  
  if (layers.risk === 'alto') {
    additional.push({ 
      metric: 'Taxa de confirmação', 
      target: '100%', 
      description: 'Todas ações críticas confirmadas',
      range: '100%'
    });
  }
  
  if (layers.urgency === 'alta') {
    additional.push({ 
      metric: 'Tempo de carregamento', 
      target: '<1s', 
      description: 'Resposta imediata crítica',
      range: '200-1000ms'
    });
  }
  
  if (layers.uncertainty === 'alta') {
    additional.push({ 
      metric: 'Disponibilidade de ajuda', 
      target: '≤2 cliques', 
      description: 'Suporte sempre acessível',
      range: '1-2 cliques'
    });
  }
  
  return [...base[quadrant], ...additional];
}

export function generateChecklist(): ChecklistItem[] {
  return [
    // Regra dos 4
    { category: 'regra_dos_4', item: 'Prioridade clara definida', status: 'pending', description: 'Hierarquia visual estabelecida' },
    { category: 'regra_dos_4', item: 'Sequência lógica (contexto→opções→ação→feedback)', status: 'pending', description: 'Fluxo natural de interação' },
    { category: 'regra_dos_4', item: 'Agrupamento consistente', status: 'pending', description: 'Elementos relacionados agrupados' },
    { category: 'regra_dos_4', item: 'Ênfase controlada (1 destaque por bloco)', status: 'pending', description: 'Foco visual direcionado' },
    
    // Estados essenciais
    { category: 'estados', item: 'Estado Vazio projetado', status: 'pending', description: 'First-run e cenários sem dados' },
    { category: 'estados', item: 'Estado Carregando definido', status: 'pending', description: 'Feedback durante processamento' },
    { category: 'estados', item: 'Estado Parcial tratado', status: 'pending', description: 'Dados incompletos ou em progresso' },
    { category: 'estados', item: 'Estado Erro com recuperação', status: 'pending', description: 'Tratamento de falhas com ações' },
    { category: 'estados', item: 'Estado Sucesso claro', status: 'pending', description: 'Confirmação de conclusão' }
  ];
}

export const NUDGE_PRESETS: NudgePreset[] = [
  {
    id: 'pix',
    title: 'Pagar com Pix',
    description: 'Pagamento rápido via Pix',
    quadrant: 'Q1',
    presets: {
      definition: {
        name: 'Pagamento via Pix',
        description: 'Realizar pagamento instantâneo usando chave Pix',
        jtbd: 'Quando preciso pagar alguém rapidamente, quero usar Pix para que o dinheiro chegue na hora'
      },
      diagnostic: {
        frequency: 4,
        information: 2
      },
      layers: {
        risk: 'alto',
        uncertainty: 'baixa',
        urgency: 'alta'
      }
    }
  },
  {
    id: 'extrato',
    title: 'Visualizar Extrato',
    description: 'Consulta detalhada de transações',
    quadrant: 'Q2',
    presets: {
      definition: {
        name: 'Consultar Extrato Bancário',
        description: 'Visualizar histórico detalhado de transações com filtros e busca',
        jtbd: 'Quando preciso entender meus gastos, quero ver meu extrato organizado para analisar padrões'
      },
      diagnostic: {
        frequency: 4,
        information: 4
      },
      layers: {
        risk: 'baixo',
        uncertainty: 'baixa',
        urgency: 'baixa'
      }
    }
  },
  {
    id: 'senha',
    title: 'Recuperar Senha',
    description: 'Redefinição de senha de acesso',
    quadrant: 'Q3',
    presets: {
      definition: {
        name: 'Recuperação de Senha',
        description: 'Redefinir senha de acesso quando esquecida',
        jtbd: 'Quando esqueço minha senha, quero recuperar o acesso de forma segura e sem complicações'
      },
      diagnostic: {
        frequency: 1,
        information: 2
      },
      layers: {
        risk: 'médio',
        uncertainty: 'baixa',
        urgency: 'média'
      }
    }
  },
  {
    id: 'emprestimo',
    title: 'Contratar Empréstimo',
    description: 'Solicitação de crédito pessoal',
    quadrant: 'Q4',
    presets: {
      definition: {
        name: 'Contratação de Empréstimo',
        description: 'Solicitar empréstimo pessoal com análise de condições e simulação',
        jtbd: 'Quando preciso de dinheiro emprestado, quero entender todas as condições para tomar a melhor decisão'
      },
      diagnostic: {
        frequency: 1,
        information: 5
      },
      layers: {
        risk: 'alto',
        uncertainty: 'alta',
        urgency: 'baixa'
      }
    }
  }
];