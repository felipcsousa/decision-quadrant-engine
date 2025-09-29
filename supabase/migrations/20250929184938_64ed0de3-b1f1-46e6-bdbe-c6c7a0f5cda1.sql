-- Seed AI suggestion templates based on ai-suggestions.ts logic

-- Get quadrant IDs
DO $$
DECLARE
  q1_id UUID;
  q2_id UUID;
  q3_id UUID;
  q4_id UUID;
BEGIN
  SELECT id INTO q1_id FROM public.quadrants WHERE code = 'Q1';
  SELECT id INTO q2_id FROM public.quadrants WHERE code = 'Q2';
  SELECT id INTO q3_id FROM public.quadrants WHERE code = 'Q3';
  SELECT id INTO q4_id FROM public.quadrants WHERE code = 'Q4';

  -- Q1 (Rotina) base suggestions
  INSERT INTO public.suggestion_templates (quadrant_id, trigger_context, trigger_value, title, description, rationale, priority, category) VALUES
    (q1_id, 'task_type', 'general', 'Botão de ação principal sempre visível', 'Posicione o CTA principal onde o polegar alcança facilmente (zona inferior direita em mobile)', 'Tarefas rotineiras precisam de acesso imediato à ação principal', 'essential', 'layout'),
    (q1_id, 'task_type', 'financial', 'Valores favoritos na primeira tela', 'Exiba os 3 valores mais usados pelo usuário como botões rápidos', 'Pagamentos rotineiros geralmente usam valores recorrentes', 'high', 'content'),
    (q1_id, 'user_profile', 'mobile', 'Gestos de deslizar para ações', 'Implemente swipe para direita = confirmar, swipe para esquerda = cancelar', 'Gestos reduzem toques em fluxos repetitivos', 'medium', 'interaction'),

  -- Q2 (Cockpit) base suggestions
    (q2_id, 'task_type', 'general', 'Filtros inteligentes com memória', 'Lembre os últimos filtros aplicados e sugira combinações frequentes', 'Usuários de cockpit têm padrões de análise que se repetem', 'essential', 'interaction'),
    (q2_id, 'task_type', 'analytics', 'Resumo executivo no topo', 'Mostre os 3 KPIs mais importantes em cards grandes antes da tabela detalhada', 'Análise começa pela visão geral, depois vai ao detalhe', 'high', 'layout'),

  -- Q3 (Guiado) base suggestions
    (q3_id, 'task_type', 'general', 'Progresso visual claro', 'Use uma barra de progresso com nomes das etapas, não apenas números', 'Tarefas ocasionais geram ansiedade; progresso tranquiliza', 'essential', 'layout'),
    (q3_id, 'task_type', 'onboarding', 'Pré-visualização do resultado', 'Mostre como ficará o perfil/conta antes de finalizar', 'Reduz incerteza em processos pouco familiares', 'high', 'content'),

  -- Q4 (Decisão) base suggestions
    (q4_id, 'task_type', 'general', 'Comparador lado a lado', 'Permita comparar opções em tabela com pros/contras claros', 'Decisões complexas precisam de comparação estruturada', 'essential', 'layout'),
    (q4_id, 'task_type', 'financial', 'Simulador interativo de impacto', 'Calcule em tempo real como a decisão afeta o orçamento mensal', 'Decisões financeiras precisam de contexto de impacto', 'high', 'interaction'),

  -- Risk-based suggestions
    (NULL, 'task_type', 'general', 'Confirmação por senha ou biometria', 'Exija autenticação adicional antes de confirmar ações críticas', 'Alto risco requer proteção contra erros ou ações maliciosas', 'essential', 'validation'),
    (NULL, 'task_type', 'financial', 'Delay de 3 segundos no botão final', 'Desabilite o botão "Confirmar" por 3 segundos para evitar cliques impulsivos', 'Transações financeiras críticas precisam de reflexão', 'high', 'interaction'),

  -- Uncertainty-based suggestions
    (NULL, 'task_type', 'general', 'Tutorial interativo na primeira vez', 'Crie um tour guiado destacando elementos principais e suas funções', 'Alta incerteza requer orientação ativa na primeira experiência', 'high', 'content'),
    (NULL, 'task_type', 'general', 'FAQ contextual inline', 'Adicione ícones de ajuda que abrem respostas curtas sem sair da tela', 'Dúvidas precisam ser resolvidas no momento sem quebrar o fluxo', 'medium', 'content'),

  -- Urgency-based suggestions
    (NULL, 'task_type', 'general', 'Carregamento otimista', 'Mostre o resultado esperado imediatamente e sincronize em background', 'Urgência não pode esperar confirmação do servidor', 'high', 'performance'),
    (q1_id, 'task_type', 'general', 'Atalho de teclado visível', 'Mostre "Ctrl+Enter para confirmar" no botão principal', 'Usuários frequentes em situação urgente usam teclado', 'medium', 'interaction'),

  -- JTBD-based contextual suggestions
    (NULL, 'jtbd_keyword', 'rápido', 'Modo express com defaults inteligentes', 'Ofereça um botão "Modo Rápido" que preenche com as opções mais comuns', 'O usuário explicitamente valoriza velocidade sobre personalização', 'high', 'interaction'),
    (NULL, 'jtbd_keyword', 'urgente', 'Modo express com defaults inteligentes', 'Ofereça um botão "Modo Rápido" que preenche com as opções mais comuns', 'O usuário explicitamente valoriza velocidade sobre personalização', 'high', 'interaction'),
    (NULL, 'jtbd_keyword', 'entender', 'Explicações progressivas', 'Comece com informação básica e permita expandir detalhes por seção', 'Compreensão requer informação estruturada em camadas', 'medium', 'content'),
    (NULL, 'jtbd_keyword', 'analisar', 'Explicações progressivas', 'Comece com informação básica e permita expandir detalhes por seção', 'Compreensão requer informação estruturada em camadas', 'medium', 'content'),
    (NULL, 'jtbd_keyword', 'segur', 'Indicadores de segurança visíveis', 'Mostre cadeado, certificações e politicas de proteção em destaque', 'Usuário demonstra preocupação com segurança', 'high', 'content'),
    (NULL, 'jtbd_keyword', 'confiança', 'Indicadores de segurança visíveis', 'Mostre cadeado, certificações e politicas de proteção em destaque', 'Usuário demonstra preocupação com segurança', 'high', 'content'),
    (NULL, 'jtbd_keyword', 'primeira', 'Onboarding contextual', 'Destaque as 3 funcionalidades mais importantes para iniciantes', 'Primeiras experiências definem adoção e retenção', 'high', 'content'),
    (NULL, 'jtbd_keyword', 'novo', 'Onboarding contextual', 'Destaque as 3 funcionalidades mais importantes para iniciantes', 'Primeiras experiências definem adoção e retenção', 'high', 'content');

  -- Update risk/uncertainty/urgency conditions for layer-specific suggestions
  UPDATE public.suggestion_templates 
  SET applies_to_risk = 'alto'
  WHERE title IN ('Confirmação por senha ou biometria', 'Delay de 3 segundos no botão final');

  UPDATE public.suggestion_templates 
  SET applies_to_uncertainty = 'alta'
  WHERE title IN ('Tutorial interativo na primeira vez', 'FAQ contextual inline');

  UPDATE public.suggestion_templates 
  SET applies_to_urgency = 'alta'
  WHERE title IN ('Carregamento otimista', 'Atalho de teclado visível', 'Modo express com defaults inteligentes');

END $$;