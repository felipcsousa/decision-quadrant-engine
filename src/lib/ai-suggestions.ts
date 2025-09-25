import { Quadrant, DecisionLayers, TaskDefinition } from '@/types/ux-analysis';

export interface AISuggestion {
  title: string;
  description: string;
  rationale: string;
  priority: 'essential' | 'high' | 'medium' | 'low';
  category: 'layout' | 'interaction' | 'content' | 'performance' | 'validation';
}

export function generateAISuggestions(
  quadrant: Quadrant,
  layers: DecisionLayers,
  definition: TaskDefinition
): AISuggestion[] {
  const suggestions: AISuggestion[] = [];
  const taskType = inferTaskType(definition);
  const userProfile = inferUserProfile(definition);

  // Base suggestions by quadrant
  suggestions.push(...getQuadrantBaseSuggestions(quadrant, taskType, userProfile));
  
  // Layer-specific refinements
  suggestions.push(...getLayerSuggestions(layers, quadrant, taskType));
  
  // Context-specific suggestions
  suggestions.push(...getContextSuggestions(definition, quadrant, layers));

  // Sort by priority and return top 8
  return suggestions
    .sort((a, b) => {
      const priorityOrder = { essential: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 8);
}

function inferTaskType(definition: TaskDefinition): string {
  const text = `${definition.name} ${definition.description} ${definition.jtbd}`.toLowerCase();
  
  if (text.includes('pagamento') || text.includes('pagar') || text.includes('transferência') || text.includes('pix')) {
    return 'financial';
  }
  if (text.includes('compra') || text.includes('carrinho') || text.includes('produto') || text.includes('checkout')) {
    return 'commerce';
  }
  if (text.includes('cadastro') || text.includes('perfil') || text.includes('conta') || text.includes('registro')) {
    return 'onboarding';
  }
  if (text.includes('consulta') || text.includes('relatório') || text.includes('extrato') || text.includes('histórico')) {
    return 'analytics';
  }
  if (text.includes('configuração') || text.includes('ajuste') || text.includes('preferência')) {
    return 'settings';
  }
  
  return 'general';
}

function inferUserProfile(definition: TaskDefinition): string {
  const text = `${definition.name} ${definition.description} ${definition.jtbd}`.toLowerCase();
  
  if (text.includes('profissional') || text.includes('empresa') || text.includes('corporativo')) {
    return 'business';
  }
  if (text.includes('idoso') || text.includes('acessibilidade') || text.includes('simples')) {
    return 'accessibility';
  }
  if (text.includes('móvel') || text.includes('celular') || text.includes('rápido')) {
    return 'mobile';
  }
  
  return 'consumer';
}

function getQuadrantBaseSuggestions(quadrant: Quadrant, taskType: string, userProfile: string): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  switch (quadrant) {
    case 'Q1': // Rotina
      suggestions.push({
        title: 'Botão de ação principal sempre visível',
        description: 'Posicione o CTA principal onde o polegar alcança facilmente (zona inferior direita em mobile)',
        rationale: 'Tarefas rotineiras precisam de acesso imediato à ação principal',
        priority: 'essential',
        category: 'layout'
      });

      if (taskType === 'financial') {
        suggestions.push({
          title: 'Valores favoritos na primeira tela',
          description: 'Exiba os 3 valores mais usados pelo usuário como botões rápidos',
          rationale: 'Pagamentos rotineiros geralmente usam valores recorrentes',
          priority: 'high',
          category: 'content'
        });
      }

      if (userProfile === 'mobile') {
        suggestions.push({
          title: 'Gestos de deslizar para ações',
          description: 'Implemente swipe para direita = confirmar, swipe para esquerda = cancelar',
          rationale: 'Gestos reduzem toques em fluxos repetitivos',
          priority: 'medium',
          category: 'interaction'
        });
      }
      break;

    case 'Q2': // Cockpit
      suggestions.push({
        title: 'Filtros inteligentes com memória',
        description: 'Lembre os últimos filtros aplicados e sugira combinações frequentes',
        rationale: 'Usuários de cockpit têm padrões de análise que se repetem',
        priority: 'essential',
        category: 'interaction'
      });

      if (taskType === 'analytics') {
        suggestions.push({
          title: 'Resumo executivo no topo',
          description: 'Mostre os 3 KPIs mais importantes em cards grandes antes da tabela detalhada',
          rationale: 'Análise começa pela visão geral, depois vai ao detalhe',
          priority: 'high',
          category: 'layout'
        });
      }
      break;

    case 'Q3': // Guiado
      suggestions.push({
        title: 'Progresso visual claro',
        description: 'Use uma barra de progresso com nomes das etapas, não apenas números',
        rationale: 'Tarefas ocasionais geram ansiedade; progresso tranquiliza',
        priority: 'essential',
        category: 'layout'
      });

      if (taskType === 'onboarding') {
        suggestions.push({
          title: 'Pré-visualização do resultado',
          description: 'Mostre como ficará o perfil/conta antes de finalizar',
          rationale: 'Reduz incerteza em processos pouco familiares',
          priority: 'high',
          category: 'content'
        });
      }
      break;

    case 'Q4': // Decisão
      suggestions.push({
        title: 'Comparador lado a lado',
        description: 'Permita comparar opções em tabela com pros/contras claros',
        rationale: 'Decisões complexas precisam de comparação estruturada',
        priority: 'essential',
        category: 'layout'
      });

      if (taskType === 'financial') {
        suggestions.push({
          title: 'Simulador interativo de impacto',
          description: 'Calcule em tempo real como a decisão afeta o orçamento mensal',
          rationale: 'Decisões financeiras precisam de contexto de impacto',
          priority: 'high',
          category: 'interaction'
        });
      }
      break;
  }

  return suggestions;
}

function getLayerSuggestions(layers: DecisionLayers, quadrant: Quadrant, taskType: string): AISuggestion[] {
  const suggestions: AISuggestion[] = [];

  // Risk-based suggestions
  if (layers.risk === 'alto') {
    suggestions.push({
      title: 'Confirmação por senha ou biometria',
      description: 'Exija autenticação adicional antes de confirmar ações críticas',
      rationale: 'Alto risco requer proteção contra erros ou ações maliciosas',
      priority: 'essential',
      category: 'validation'
    });

    if (taskType === 'financial') {
      suggestions.push({
        title: 'Delay de 3 segundos no botão final',
        description: 'Desabilite o botão "Confirmar" por 3 segundos para evitar cliques impulsivos',
        rationale: 'Transações financeiras críticas precisam de reflexão',
        priority: 'high',
        category: 'interaction'
      });
    }
  }

  // Uncertainty-based suggestions
  if (layers.uncertainty === 'alta') {
    suggestions.push({
      title: 'Tutorial interativo na primeira vez',
      description: 'Crie um tour guiado destacando elementos principais e suas funções',
      rationale: 'Alta incerteza requer orientação ativa na primeira experiência',
      priority: 'high',
      category: 'content'
    });

    suggestions.push({
      title: 'FAQ contextual inline',
      description: 'Adicione ícones de ajuda que abrem respostas curtas sem sair da tela',
      rationale: 'Dúvidas precisam ser resolvidas no momento sem quebrar o fluxo',
      priority: 'medium',
      category: 'content'
    });
  }

  // Urgency-based suggestions
  if (layers.urgency === 'alta') {
    suggestions.push({
      title: 'Carregamento otimista',
      description: 'Mostre o resultado esperado imediatamente e sincronize em background',
      rationale: 'Urgência não pode esperar confirmação do servidor',
      priority: 'high',
      category: 'performance'
    });

    if (quadrant === 'Q1') {
      suggestions.push({
        title: 'Atalho de teclado visível',
        description: 'Mostre "Ctrl+Enter para confirmar" no botão principal',
        rationale: 'Usuários frequentes em situação urgente usam teclado',
        priority: 'medium',
        category: 'interaction'
      });
    }
  }

  return suggestions;
}

function getContextSuggestions(definition: TaskDefinition, quadrant: Quadrant, layers: DecisionLayers): AISuggestion[] {
  const suggestions: AISuggestion[] = [];
  
  // JTBD-based contextual suggestions
  const jtbd = definition.jtbd.toLowerCase();
  
  if (jtbd.includes('rápido') || jtbd.includes('urgente')) {
    suggestions.push({
      title: 'Modo express com defaults inteligentes',
      description: 'Ofereça um botão "Modo Rápido" que preenche com as opções mais comuns',
      rationale: 'O usuário explicitamente valoriza velocidade sobre personalização',
      priority: 'high',
      category: 'interaction'
    });
  }

  if (jtbd.includes('entender') || jtbd.includes('analisar')) {
    suggestions.push({
      title: 'Explicações progressivas',
      description: 'Comece com informação básica e permita expandir detalhes por seção',
      rationale: 'Compreensão requer informação estruturada em camadas',
      priority: 'medium',
      category: 'content'
    });
  }

  if (jtbd.includes('segur') || jtbd.includes('confiança')) {
    suggestions.push({
      title: 'Indicadores de segurança visíveis',
      description: 'Mostre cadeado, certificações e politicas de proteção em destaque',
      rationale: 'Usuário demonstra preocupação com segurança',
      priority: 'high',
      category: 'content'
    });
  }

  // Task name insights
  if (definition.name.toLowerCase().includes('primeira') || definition.name.toLowerCase().includes('novo')) {
    suggestions.push({
      title: 'Onboarding contextual',
      description: 'Destaque as 3 funcionalidades mais importantes para iniciantes',
      rationale: 'Primeiras experiências definem adoção e retenção',
      priority: 'high',
      category: 'content'
    });
  }

  return suggestions;
}