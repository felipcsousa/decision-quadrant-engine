-- Seed data for content tables

-- Insert quadrants
INSERT INTO public.quadrants (code, name, archetype, guideline, description) VALUES
  ('Q1', 'Rotina', 'Ações frequentes e diretas', 'Otimização para velocidade e eficiência', 'Tarefas rotineiras que o usuário executa frequentemente com pouca necessidade de informação.'),
  ('Q2', 'Cockpit', 'Análise frequente com múltiplas variáveis', 'Interface rica em informação e controles', 'Tarefas frequentes que requerem análise de informações complexas.'),
  ('Q3', 'Guiado', 'Tarefas ocasionais e simples', 'Orientação clara passo a passo', 'Tarefas simples executadas ocasionalmente que precisam de orientação.'),
  ('Q4', 'Decisão Pontual', 'Tarefas complexas e ocasionais', 'Organização e clareza com validação precoce', 'Tarefas complexas executadas ocasionalmente que exigem análise cuidadosa.')
ON CONFLICT (code) DO NOTHING;

-- Get quadrant IDs for foreign key references
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

  -- Insert quadrant patterns
  INSERT INTO public.quadrant_patterns (quadrant_id, name, description, category, display_order) VALUES
    (q1_id, 'Ações Rápidas', 'Botões principais sempre visíveis e acessíveis', 'base', 1),
    (q1_id, 'Preenchimento Inteligente', 'Lembrar últimos valores e sugerir automaticamente', 'base', 2),
    (q1_id, 'Resposta Imediata', 'Mostrar resultado antes da confirmação do servidor', 'base', 3),
    (q1_id, 'Memória Muscular', 'Manter posições e gestos consistentes entre versões', 'base', 4),
    
    (q2_id, 'Visão Geral → Detalhes', 'Começar com resumo executivo, depois permitir drill-down', 'base', 1),
    (q2_id, 'Filtros por Categoria', 'Organizar filtros em grupos com contadores', 'base', 2),
    (q2_id, 'Busca Inteligente', 'Sugestões automáticas e busca por múltiplos campos', 'base', 3),
    (q2_id, 'Ações em Lote', 'Selecionar múltiplos itens para operações simultâneas', 'base', 4),
    (q2_id, 'Configurações Salvas', 'Permitir salvar combinações de filtros favoritas', 'base', 5),
    
    (q3_id, 'Assistente Simples', 'Uma decisão por tela com progresso claro', 'base', 1),
    (q3_id, 'Ajuda Contextual', 'Dicas e exemplos próximos aos campos', 'base', 2),
    (q3_id, 'Revisar e Voltar', 'Sempre permitir corrigir antes de finalizar', 'base', 3),
    
    (q4_id, 'Assistente Completo', 'Múltiplos passos com navegação livre entre eles', 'base', 1),
    (q4_id, 'Salvamento Automático', 'Nunca perder progresso por problemas técnicos', 'base', 2),
    (q4_id, 'Validação Imediata', 'Avisar sobre problemas assim que o campo é preenchido', 'base', 3),
    (q4_id, 'Resumo Lateral', 'Painel fixo mostrando escolhas atuais', 'base', 4),
    (q4_id, 'Navegação Flexível', 'Links diretos para retomar em qualquer ponto', 'base', 5);

  -- Insert detailed sections for Q1
  INSERT INTO public.quadrant_detailed_sections (quadrant_id, section_type, title, objective, items, checklist_items, anti_patterns, display_order) VALUES
    (q1_id, 'layout', 'Layout & Interface', 'Minimizar carga de decisão: um caminho dominante, sem forks. Favorecer memória muscular: posições/gestos estáveis e atalhos.', 
     '["Header enxuto com ação primária evidente", "Cards/linhas com um CTA principal; opções secundárias em menus contextuais", "Prefill/autofill agressivo (últimos valores, favoritos, templates)"]'::jsonb,
     '["≤2 toques para ação comum", "Prefill/autofill implementado"]'::jsonb,
     '["Confirmações redundantes", "Deslocar CTA primário entre versões"]'::jsonb, 1),
    
    (q1_id, 'interactions', 'Interações', NULL,
     '["Interface otimista: mostrar resultado antes de confirmar servidor; manter desfazer por 5-10s", "Gestos rápidos (ex.: swipe para ação) com confirmação apenas se Risco ≥ Médio"]'::jsonb,
     '["Desfazer disponível", "Sem modais desnecessários"]'::jsonb,
     '["Quebrar hábito do usuário"]'::jsonb, 2),
    
    (q1_id, 'states', 'Estados e Feedback', NULL,
     '["Loading: skeleton curto (≤300ms) antes de mostrar dado antigo", "Sucesso: banner discreto com próxima ação", "Erro: mensagens locais com solução em 1 clique"]'::jsonb,
     '["Feedback ≤100ms", "Estados (vazio/carregando/erro/sucesso) definidos"]'::jsonb,
     '[]'::jsonb, 3),
    
    (q1_id, 'microtext', 'Microtexto', NULL,
     '["Verbo no imperativo curto (Pagar, Enviar)", "Evitar tecnicismos; focar no resultado", "Sem perguntas retóricas em confirmação de baixo risco"]'::jsonb,
     '[]'::jsonb,
     '[]'::jsonb, 4);

  -- Insert detailed sections for Q2
  INSERT INTO public.quadrant_detailed_sections (quadrant_id, section_type, title, objective, items, checklist_items, anti_patterns, display_order) VALUES
    (q2_id, 'layout', 'Layout & Interface', 'Visão geral que orienta ação: o usuário decide o que atacar antes de como. Manter contexto ao filtrar/navegar.',
     '["Overview→detail com painel resumo (KPIs, alertas) e lista/tabela principal", "Filtros por categoria + busca; contadores por filtro; chips removíveis", "Vistas salvas por usuário e padrões de seleção múltipla"]'::jsonb,
     '["Overview→detail implementado", "Filtros por categoria + busca", "Vistas salvas disponíveis"]'::jsonb,
     '["Modais encadeados", "Filtros que resetam ao navegar", "Scroll infinito sem sumário"]'::jsonb, 1),
    
    (q2_id, 'interactions', 'Interações', NULL,
     '["Ações primárias inline (evitar modal)", "Atalhos de teclado (↑/↓, Enter, Cmd+K)", "Navegação persistente entre views"]'::jsonb,
     '["Ações em lote implementadas", "Resposta ≈300ms"]'::jsonb,
     '["Tabelas densas sem affordances"]'::jsonb, 2),
    
    (q2_id, 'states', 'Estados e Feedback', NULL,
     '["Loading parcial: skeleton na área afetada; manter dados anteriores", "Erros de filtro/busca isolados e reversíveis"]'::jsonb,
     '["Estados completos definidos"]'::jsonb,
     '[]'::jsonb, 3),
    
    (q2_id, 'microtext', 'Microtexto', NULL,
     '["Rótulos curtos, consistentes (filtro/coluna)", "Explicar regras de ordenação e escopo da busca"]'::jsonb,
     '[]'::jsonb,
     '[]'::jsonb, 4);

  -- Insert detailed sections for Q3
  INSERT INTO public.quadrant_detailed_sections (quadrant_id, section_type, title, objective, items, checklist_items, anti_patterns, display_order) VALUES
    (q3_id, 'layout', 'Layout & Interface', 'Reduzir ansiedade em tarefa rara: clareza, validação imediata, possibilidade de voltar.',
     '["Uma decisão por tela; progresso de 2–3 passos; review final", "Conteúdo com micro-exemplos; esconder avançado por colapso"]'::jsonb,
     '["2–3 passos definidos", "Uma decisão por tela"]'::jsonb,
     '["Tudo numa tela ou mais de 5 passos", "Ajuda escondida em FAQ externo"]'::jsonb, 1),
    
    (q3_id, 'interactions', 'Interações', NULL,
     '["Botões Voltar/Avançar previsíveis", "Salvar rascunho opcional se tempo >2–3 min", "Desfazer após submissão quando possível"]'::jsonb,
     '["Review/desfazer implementado"]'::jsonb,
     '["Erros no final que poderiam ser detectados no início"]'::jsonb, 2),
    
    (q3_id, 'states', 'Estados e Feedback', NULL,
     '["Validação inline (ao sair do campo)", "Mensagens just-in-time", "Sucesso com próximo passo sugerido"]'::jsonb,
     '["Validação precoce", "Estados completos"]'::jsonb,
     '[]'::jsonb, 3),
    
    (q3_id, 'microtext', 'Microtexto', NULL,
     '["Perguntas diretas (Qual é…?), exemplos curtos", "Evitar condicionalidade complexa", "Títulos em forma de tarefa (Confirmar e enviar)"]'::jsonb,
     '[]'::jsonb,
     '[]'::jsonb, 4);

  -- Insert detailed sections for Q4
  INSERT INTO public.quadrant_detailed_sections (quadrant_id, section_type, title, objective, items, checklist_items, anti_patterns, display_order) VALUES
    (q4_id, 'layout', 'Layout & Interface', 'Tomada de decisão informada com segurança; preservar contexto, evitar perda de progresso.',
     '["Assistente/stepper com resumo fixo (lateral/topo), âncoras por seção, breadcrumbs", "Campos críticos próximos ao resumo", "Comparações e mini-simulações determinísticas"]'::jsonb,
     '["Assistente/stepper implementado", "Resumo fixo presente"]'::jsonb,
     '["Solicitar tudo antes de dar visão do impacto", "Validação tardia", "Salvar dependente de uma única ação"]'::jsonb, 1),
    
    (q4_id, 'interactions', 'Interações', NULL,
     '["Autosave a cada campo/etapa", "Validação precoce e mensagens preditivas", "Deep links para retomar no ponto", "Review final com diffs"]'::jsonb,
     '["Autosave funcionando", "Validação precoce", "Deep links/breadcrumbs"]'::jsonb,
     '["Scroll infinito sem navegação estrutural"]'::jsonb, 2),
    
    (q4_id, 'states', 'Estados e Feedback', NULL,
     '["Parcial persistente; sinalizar rascunho salvo", "Erros com explicação + como corrigir", "Log de validações críticas no resumo"]'::jsonb,
     '["Estados completos"]'::jsonb,
     '[]'::jsonb, 3),
    
    (q4_id, 'microtext', 'Microtexto', NULL,
     '["Explicitar trade-offs (Maior segurança, maior tempo)", "Evitar jargão; quando inevitável, definição inline"]'::jsonb,
     '[]'::jsonb,
     '[]'::jsonb, 4);

  -- Insert guardrails
  INSERT INTO public.guardrails (quadrant_id, metric_name, target_value, description, range_value, display_order) VALUES
    (q1_id, 'Toques para ação principal', '≤2 toques', 'Eficiência de acesso', '1-2 toques', 1),
    (q1_id, 'Tempo para conclusão', '≤5s', 'Meta de velocidade', '3-5s', 2),
    (q1_id, 'Taxa de sucesso', '≥95%', 'Eficácia da interface', '95-100%', 3),
    (q1_id, 'Taxa de desfazer', '<5%', 'Qualidade das ações otimistas', NULL, 4),
    
    (q2_id, 'Resposta de filtros', '300ms ± 100ms', 'Filtros reativos', '200-400ms', 1),
    (q2_id, 'Densidade de informação', '7±2 elementos por grupo', 'Legibilidade mantida', '5-9 elementos', 2),
    (q2_id, 'Tempo de scan', '≤15s para overview', 'Compreensão rápida', '10-15s', 3),
    (q2_id, 'Uso de vistas salvas', '>40%', 'Reuso de configurações', NULL, 4),
    
    (q3_id, 'Decisões por tela', '1 decisão', 'Simplicidade cognitiva', '1 decisão', 1),
    (q3_id, 'Clareza de sucesso', '100%', 'Feedback inequívoco', '95-100%', 2),
    (q3_id, 'Taxa de abandono', '≤15%', 'Fluxo bem guiado', '5-15%', 3),
    (q3_id, 'Conclusão sem ajuda', '>80%', 'Autoexplicativo', NULL, 4),
    
    (q4_id, 'Prevenção de perda', 'Zero perda', 'Progresso sempre salvo', '0% perda', 1),
    (q4_id, 'Validação real-time', '≤2s após input', 'Detecção precoce de erros', '1-2s', 2),
    (q4_id, 'Tempo de preenchimento', '≤20min', 'Processo não exaustivo', '15-20min', 3),
    (q4_id, 'Taxa de revisita', '<30%', 'Conclusão em primeira tentativa', NULL, 4);
END $$;

-- Insert layers configuration
INSERT INTO public.layers_config (layer_type, level, ux_guidance, validation_guidance, copy_guidance, measurement_guidance) VALUES
  ('risk', 'baixo', 'Otimizar para ritmo. Confirmar apenas onde retorno é custoso.', 'Leve, inline; desfazer amplo.', 'Direta; evitar tem certeza? desnecessário.', 'Taxa de desfazer; erros silenciosos toleráveis se reversíveis.'),
  ('risk', 'médio', 'Confirmar mudanças estruturais; destacar campos críticos.', 'Checagens de consistência; alertas antes do submit.', 'Você está alterando X; isso afeta Y.', 'Incidentes por 1.000 ações; tempo extra por confirmação.'),
  ('risk', 'alto', 'Confirmação explícita; autenticação reforçada; review step.', 'Regras preventivas; simulações; double-check.', 'Consequências e reversibilidade (Irreversível, Estorna até 30 min).', 'Zero falhas catastróficas; monitorar near-miss.'),
  
  ('uncertainty', 'baixa', 'Esconder ajuda por padrão; mostrar apenas on-demand.', 'Mensagens concisas; sugestões suaves.', 'Focada no resultado, sem porque.', 'Taxa de consulta à ajuda.'),
  ('uncertainty', 'média', 'Exemplos concretos, micro-tutorial; pré-vias de efeito.', 'Confirmar regras implícitas.', 'Explique o porquê em uma linha.', 'Tempo até primeira ação.'),
  ('uncertainty', 'alta', 'Ajuda contextual robusta; histórico; mini-simulação.', 'Explicações vinculadas ao erro.', 'Perguntas guiadas em linguagem natural.', 'Taxa de erro por falta de compreensão.'),
  
  ('urgency', 'baixa', 'Hierarquia padrão; espaço para leitura.', 'Sem pressa; foco em exatidão.', 'Calma, neutra.', 'Taxa de conclusão.'),
  ('urgency', 'média', 'Atalhos, autocompletar; priorizar frequentes no topo.', 'Feedback rápido; erros com correção em 1 clique.', 'Objetiva (Pronto em segundos).', 'Tempo médio de conclusão.'),
  ('urgency', 'alta', 'Modo rápido: defaults seguros; encontrabilidade ≤2s.', 'Máxima antecipação; fallback offline.', 'Enxuta, com estado do sistema (Enviado, Em processamento).', 'Tempo de resposta da interface.')
ON CONFLICT (layer_type, level, version) DO NOTHING;

-- Insert pattern refinements
INSERT INTO public.pattern_refinements (layer_type, level, name, description, category, priority) VALUES
  ('risk', 'alto', 'Dupla Confirmação', 'Pedir confirmação adicional com senha ou biometria', 'refinement', 'high'),
  ('risk', 'alto', 'Delay de Reflexão', 'Aguardar 3 segundos antes de habilitar ação crítica', 'refinement', 'high'),
  ('risk', 'alto', 'Consequências Visíveis', 'Mostrar claramente o que acontecerá após a ação', 'refinement', 'medium'),
  
  ('uncertainty', 'alta', 'Tutorial Interativo', 'Guia prático na primeira utilização', 'refinement', 'high'),
  ('uncertainty', 'alta', 'Exemplos Reais', 'Mostrar casos similares ou histórico de decisões', 'refinement', 'medium'),
  ('uncertainty', 'alta', 'Simulação em Tempo Real', 'Calcular impacto das escolhas conforme o usuário preenche', 'refinement', 'low'),
  
  ('urgency', 'alta', 'Acesso em 2 Segundos', 'Função principal acessível em menos de 2 segundos', 'refinement', 'high'),
  ('urgency', 'alta', 'Atalhos de Teclado', 'Permitir completar ação com teclas (Ctrl+Enter)', 'refinement', 'high'),
  ('urgency', 'alta', 'Resposta Instantânea', 'Feedback visual em menos de 300ms', 'refinement', 'medium');

-- Insert checklist items
INSERT INTO public.checklist_items (category, item, description, display_order) VALUES
  ('regra_dos_4', 'Prioridade clara definida', 'Hierarquia visual estabelecida', 1),
  ('regra_dos_4', 'Sequência lógica (contexto→opções→ação→feedback)', 'Fluxo natural de interação', 2),
  ('regra_dos_4', 'Agrupamento consistente', 'Elementos relacionados agrupados', 3),
  ('regra_dos_4', 'Ênfase controlada (1 destaque por bloco)', 'Foco visual direcionado', 4),
  
  ('estados', 'Estado Vazio projetado', 'First-run e cenários sem dados', 1),
  ('estados', 'Estado Carregando definido', 'Feedback durante processamento', 2),
  ('estados', 'Estado Parcial tratado', 'Dados incompletos ou em progresso', 3),
  ('estados', 'Estado Erro com recuperação', 'Tratamento de falhas com ações', 4),
  ('estados', 'Estado Sucesso claro', 'Confirmação de conclusão', 5);

-- Insert transversal recommendations
INSERT INTO public.transversal_recommendations (recommendation, display_order) VALUES
  ('Padrões de confirmação devem ser raros em Q1 e inevitáveis em Risco Alto', 1),
  ('Autosave é mandatório em Q4; opcional em Q3 se o preenchimento passar de 2–3 minutos', 2),
  ('Resumos fixos (Q4) são o seguro cognitivo: devem mostrar só o essencial', 3),
  ('Filtros por categoria em Q2 precisam de contagem e chips removíveis', 4),
  ('Estados Parcial e Vazio não são decorativos: defina conteúdo útil', 5),
  ('Motion/haptic: Q1/Q2 → micro-transições discretas; Q3/Q4 → transições que reforçam sequência', 6);