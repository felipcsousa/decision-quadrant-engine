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
      { name: 'Quick Actions', description: 'Ações rápidas e diretas', category: 'base' as const },
      { name: 'Autofill', description: 'Preenchimento automático', category: 'base' as const },
      { name: 'Optimistic UI', description: 'Interface otimista', category: 'base' as const },
      { name: 'Feedback Imediato', description: 'Resposta instantânea', category: 'base' as const }
    ],
    Q2: [
      { name: 'Overview → Detail', description: 'Visão geral para detalhe', category: 'base' as const },
      { name: 'Filtros Facetados', description: 'Filtragem multi-dimensional', category: 'base' as const },
      { name: 'Busca Avançada', description: 'Pesquisa sofisticada', category: 'base' as const },
      { name: 'Seleção Múltipla', description: 'Operações em lote', category: 'base' as const },
      { name: 'Vistas Salvas', description: 'Configurações personalizadas', category: 'base' as const }
    ],
    Q3: [
      { name: 'Fluxo Passo-a-Passo', description: 'Orientação sequencial', category: 'base' as const },
      { name: 'Helper Text', description: 'Textos de ajuda contextual', category: 'base' as const },
      { name: 'Review/Undo', description: 'Revisão e desfazer', category: 'base' as const }
    ],
    Q4: [
      { name: 'Wizard/Stepper', description: 'Assistente passo a passo', category: 'base' as const },
      { name: 'Autosave', description: 'Salvamento automático', category: 'base' as const },
      { name: 'Validação Precoce', description: 'Validação durante preenchimento', category: 'base' as const },
      { name: 'Resumo Fixo', description: 'Sumário sempre visível', category: 'base' as const },
      { name: 'Breadcrumbs/Deep Link', description: 'Navegação e links profundos', category: 'base' as const }
    ]
  };
  
  return patterns[quadrant];
}

export function refineByLayers(basePatterns: Pattern[], layers: DecisionLayers): Pattern[] {
  const refinements: Pattern[] = [];
  
  if (layers.risk === 'alto') {
    refinements.push(
      { name: 'Confirmação Explícita', description: 'Confirmação obrigatória para ações críticas', category: 'refinement' },
      { name: 'Autenticação Reforçada', description: 'Biometria ou senha adicional', category: 'refinement' },
      { name: 'Destaque de Consequências', description: 'Impactos claramente visíveis', category: 'refinement' }
    );
  }
  
  if (layers.uncertainty === 'alta') {
    refinements.push(
      { name: 'Ajuda Contextual', description: 'Suporte integrado ao fluxo', category: 'refinement' },
      { name: 'Histórico/Antes-Depois', description: 'Referências de contexto', category: 'refinement' },
      { name: 'Mini-Simulação', description: 'Preview determinístico', category: 'refinement' }
    );
  }
  
  if (layers.urgency === 'alta') {
    refinements.push(
      { name: 'Encontrabilidade ≤2s', description: 'Acesso imediato', category: 'refinement' },
      { name: 'Atalhos/CTA Primário', description: 'Ações principais sempre visíveis', category: 'refinement' },
      { name: 'Feedback Quase Imediato', description: 'Resposta em <300ms', category: 'refinement' }
    );
  }
  
  return [...basePatterns, ...refinements];
}

export function getGuardrails(quadrant: Quadrant, layers: DecisionLayers): Guardrail[] {
  const base = {
    Q1: [
      { metric: 'Toques para ação principal', target: '≤2 toques', description: 'Eficiência de acesso' },
      { metric: 'Tempo para conclusão', target: '≤5s', description: 'Meta de velocidade' }
    ],
    Q2: [
      { metric: 'Resposta de filtros', target: '~300ms', description: 'Filtros reativos' },
      { metric: 'Densidade de informação', target: 'Escaneável', description: 'Legibilidade mantida' }
    ],
    Q3: [
      { metric: 'Decisões por tela', target: '1 decisão', description: 'Simplicidade cognitiva' },
      { metric: 'Clareza de sucesso', target: 'Explícita', description: 'Feedback inequívoco' }
    ],
    Q4: [
      { metric: 'Prevenção de perda', target: 'Zero perda', description: 'Progresso sempre salvo' },
      { metric: 'Consistência de inputs', target: 'Validação real-time', description: 'Detecção precoce de erros' }
    ]
  };
  
  const additional: Guardrail[] = [];
  
  if (layers.risk === 'alto') {
    additional.push({ metric: 'Taxa de confirmação', target: '100%', description: 'Todas ações críticas confirmadas' });
  }
  
  if (layers.urgency === 'alta') {
    additional.push({ metric: 'Tempo de carregamento', target: '<1s', description: 'Resposta imediata crítica' });
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