-- Enriquecer conteúdo dos quadrantes com base no Guia UX Mobile v1.1

-- ================================================
-- 1. ATUALIZAR SEÇÕES DETALHADAS DOS QUADRANTES
-- ================================================

-- Q1 - Rotina: Layout & "IA" determinística
UPDATE quadrant_detailed_sections
SET 
  objective = 'Minimizar decisão com um caminho dominante, sem forks. Favorecer memória muscular através de posições e gestos estáveis.',
  items = jsonb_build_array(
    jsonb_build_object(
      'title', 'Header Enxuto',
      'description', 'Header com CTA primário evidente (ex.: "Pagar"). Destaque visual claro para ação principal.'
    ),
    jsonb_build_object(
      'title', 'Cards com 1 CTA Principal',
      'description', 'Cards ou linhas com 1 CTA principal visível. Opções secundárias em menu de contexto (… ou swipe oculto, mas ensinável).'
    ),
    jsonb_build_object(
      'title', 'Prefill/Autofill Agressivo',
      'description', 'Preencher automaticamente com últimos valores, favoritos, templates. Oferecer atalhos de valor (ex: R$ 50/100/200) para reduzir fricção.'
    ),
    jsonb_build_object(
      'title', 'Lista de Favoritos Inteligente',
      'description', 'Exemplo: lista de Pix favoritos mostra os 3 mais usados, com tap direto no valor recente e chip "Outro valor" para casos excepcionais.'
    )
  )
WHERE quadrant_id = (SELECT id FROM quadrants WHERE code = 'Q1')
  AND section_type = 'layout';

-- Q1 - Rotina: Interações
UPDATE quadrant_detailed_sections
SET 
  objective = 'Otimizar para velocidade e memória muscular com interações rápidas e previsíveis.',
  items = jsonb_build_array(
    jsonb_build_object(
      'title', 'Optimistic UI',
      'description', 'Quando reversível: aplicar mudança imediatamente, sincronizar depois. Oferecer Undo por 5-10s via snackbar "Desfazer".'
    ),
    jsonb_build_object(
      'title', 'Gestos Rápidos',
      'description', 'Implementar gestos como swipe esquerda "Pagar", direita "Favoritar". Confirmar apenas se Risco ≥ Médio.'
    ),
    jsonb_build_object(
      'title', 'Haptics Contextuais',
      'description', 'Feedback tátil leve para sucesso, médio para erro. Silenciar durante scroll para não sobrecarregar.'
    ),
    jsonb_build_object(
      'title', 'Quick Actions',
      'description', 'Implementar long-press no ícone do app (iOS/Android) para atalhos frequentes diretos às ações mais comuns.'
    )
  )
WHERE quadrant_id = (SELECT id FROM quadrants WHERE code = 'Q1')
  AND section_type = 'interactions';

-- Q1 - Rotina: Estados e Feedback
UPDATE quadrant_detailed_sections
SET 
  objective = 'Feedback rápido e discreto que não interrompe o fluxo de trabalho.',
  items = jsonb_build_array(
    jsonb_build_object(
      'title', 'Loading Skeleton',
      'description', 'Skeleton visível apenas se latência > 300ms. Se exceder, mostrar dado antigo com indicador "atualizando…".'
    ),
    jsonb_build_object(
      'title', 'Sucesso Discreto',
      'description', 'Banner sutil com próxima ação sugerida: "Fazer de novo", "Salvar como atalho". Não bloquear interface.'
    ),
    jsonb_build_object(
      'title', 'Erro Recuperável',
      'description', 'Mensagem local + 1 clique "Tentar novamente". Se offline, criar fila de reenvio automática com badge de pendências.'
    ),
    jsonb_build_object(
      'title', 'Empty State Útil',
      'description', 'Quando vazio, sugerir criar favorito/atalho com 1 exemplo pré-preenchido para facilitar primeiro uso.'
    )
  )
WHERE quadrant_id = (SELECT id FROM quadrants WHERE code = 'Q1')
  AND section_type = 'states';

-- Q1 - Rotina: Microcopy
UPDATE quadrant_detailed_sections
SET 
  objective = 'Copy direta e focada em ação, sem ruído ou perguntas retóricas.',
  items = jsonb_build_array(
    jsonb_build_object(
      'title', 'Imperativo Curto',
      'description', 'Usar verbos imperativos curtos: "Pagar", "Enviar", "Confirmar". Focar no resultado: "Pix enviado", "Recarga feita".'
    ),
    jsonb_build_object(
      'title', 'Evitar Confirmações Desnecessárias',
      'description', 'Sem perguntas retóricas em confirmações de baixo risco. Evitar "Tem certeza?" quando ação é reversível.'
    ),
    jsonb_build_object(
      'title', 'Templates de Sucesso',
      'description', 'Usar templates consistentes: "Recarga feita." → [Fazer de novo] [Definir como padrão]. Facilitar repetição.'
    )
  )
WHERE quadrant_id = (SELECT id FROM quadrants WHERE code = 'Q1')
  AND section_type = 'microtext';

-- Q2 - Cockpit: Layout & "IA" determinística
UPDATE quadrant_detailed_sections
SET 
  objective = 'Visão que orienta ação: decidir o que atacar antes do como. Manter contexto ao filtrar/navegar.',
  items = jsonb_build_array(
    jsonb_build_object(
      'title', 'Overview → Detail',
      'description', 'Estrutura com painel resumo (KPIs, alertas) + lista/tabela principal. Usuário vê contexto antes de mergulhar nos detalhes.'
    ),
    jsonb_build_object(
      'title', 'Filtros Facetados',
      'description', 'Implementar filtros com contadores por categoria. Mostrar chips removíveis para filtros ativos. Exemplo: "Pix (23)", "Boleto (5)".'
    ),
    jsonb_build_object(
      'title', 'Vistas Salvas',
      'description', 'Permitir usuário salvar combinações de filtros como "vistas" nomeadas. Facilita retorno a contextos frequentes.'
    ),
    jsonb_build_object(
      'title', 'Seleção Múltipla',
      'description', 'Botão "Selecionar" ativa modo de seleção múltipla para ações em lote. Exemplo: "Transações" com botão "Marcar como revisadas".'
    )
  )
WHERE quadrant_id = (SELECT id FROM quadrants WHERE code = 'Q2')
  AND section_type = 'layout';

-- Q2 - Cockpit: Interações
UPDATE quadrant_detailed_sections
SET 
  objective = 'Facilitar exploração e ações rápidas sem perder contexto.',
  items = jsonb_build_array(
    jsonb_build_object(
      'title', 'Ações Inline',
      'description', 'Ações primárias diretas na lista, evitar modal quando possível. Usar bottom sheet para detalhes quando não quebrar fluxo.'
    ),
    jsonb_build_object(
      'title', 'Navegação Persistente',
      'description', 'Tab bar fixa (iOS) ou bottom app bar (Android). Retorno mantém posição de scroll e filtros aplicados.'
    ),
    jsonb_build_object(
      'title', 'Atalhos de Teclado',
      'description', 'Pesquisa global via Cmd/Ctrl+K em teclado externo. Pull-to-refresh para atualizar dados.'
    ),
    jsonb_build_object(
      'title', 'SearchBar com Debounce',
      'description', 'Busca com debounce (~300ms) para evitar excesso de requisições. Mostrar query atual sempre visível.'
    )
  )
WHERE quadrant_id = (SELECT id FROM quadrants WHERE code = 'Q2')
  AND section_type = 'interactions';

-- Q3 - Guiado: Layout & Fluxo
UPDATE quadrant_detailed_sections
SET 
  objective = 'Reduzir ansiedade em tarefa rara com clareza, validação imediata e possibilidade de voltar sempre.',
  items = jsonb_build_array(
    jsonb_build_object(
      'title', 'Uma Decisão por Tela',
      'description', 'Dividir fluxo em 2-3 passos máximo, com uma decisão clara por tela. Exemplo: "Cadastrar recebedor" → Passo 1 (Nome/CPF) → Passo 2 (Chave Pix) → Review → Enviar.'
    ),
    jsonb_build_object(
      'title', 'Micro-exemplos',
      'description', 'Incluir exemplos curtos em campos para guiar preenchimento. Opções avançadas em collapses separados.'
    ),
    jsonb_build_object(
      'title', 'Review Final',
      'description', 'Sempre mostrar tela de revisão antes de enviar, permitindo correção sem perder progresso.'
    ),
    jsonb_build_object(
      'title', 'Step Indicator',
      'description', 'Indicador visual simples de progresso (ex: "Passo 2 de 3") para reduzir ansiedade.'
    )
  )
WHERE quadrant_id = (SELECT id FROM quadrants WHERE code = 'Q3')
  AND section_type = 'layout';

-- Q3 - Guiado: Interações
UPDATE quadrant_detailed_sections
SET 
  objective = 'Navegação previsível com possibilidade de voltar e corrigir a qualquer momento.',
  items = jsonb_build_array(
    jsonb_build_object(
      'title', 'Botões Voltar/Avançar Previsíveis',
      'description', 'Posição consistente de botões Voltar/Avançar. Permitir navegação entre passos sem perder dados.'
    ),
    jsonb_build_object(
      'title', 'Salvar Rascunho',
      'description', 'Se tempo médio do fluxo > 2-3 min, salvar rascunho automaticamente. Permitir retomar mais tarde.'
    ),
    jsonb_build_object(
      'title', 'Undo Pós-submissão',
      'description', 'Quando permitido, oferecer undo após submissão (ex: cancelar agendamento nos primeiros 10 min).'
    ),
    jsonb_build_object(
      'title', 'Keyboard-aware Scroll',
      'description', 'Scroll automático para campo focado quando teclado aparecer, evitando campos ocultos.'
    )
  )
WHERE quadrant_id = (SELECT id FROM quadrants WHERE code = 'Q3')
  AND section_type = 'interactions';

-- Q4 - Decisão: Layout & Fluxo
UPDATE quadrant_detailed_sections
SET 
  objective = 'Tomar decisão com segurança, preservando contexto e evitando perda de progresso.',
  items = jsonb_build_array(
    jsonb_build_object(
      'title', 'Wizard com Resumo Fixo',
      'description', 'Stepper com resumo fixo no topo ou em sheet colapsável. Breadcrumbs para navegação entre seções.'
    ),
    jsonb_build_object(
      'title', 'Campos Críticos Próximos ao Resumo',
      'description', 'Posicionar campos que afetam cálculos próximos ao painel de resumo para feedback visual imediato.'
    ),
    jsonb_build_object(
      'title', 'Detalhes em Accordion',
      'description', 'Informações secundárias em accordion/DisclosureGroup para não sobrecarregar interface.'
    ),
    jsonb_build_object(
      'title', 'Mini-simulações',
      'description', 'Quando houver fórmula/regra determinística, mostrar simulação. Ex: "Contratar empréstimo" → Ver custo total/IOF antes de assinar.'
    )
  )
WHERE quadrant_id = (SELECT id FROM quadrants WHERE code = 'Q4')
  AND section_type = 'layout';

-- Q4 - Decisão: Interações
UPDATE quadrant_detailed_sections
SET 
  objective = 'Preservar progresso e dar segurança através de autosave e validações precoces.',
  items = jsonb_build_array(
    jsonb_build_object(
      'title', 'Autosave por Campo',
      'description', 'Salvar automaticamente a cada campo preenchido. Mostrar indicador "Rascunho salvo" discreto.'
    ),
    jsonb_build_object(
      'title', 'Validação Precoce',
      'description', 'Validar e mostrar mensagens preditivas: "Valor excede limite", "Aprovação pode levar 2-3 dias úteis".'
    ),
    jsonb_build_object(
      'title', 'Deep Links',
      'description', 'Implementar deep links para retomar fluxo de onde parou. Útil para fluxos longos ou multi-dispositivo.'
    ),
    jsonb_build_object(
      'title', 'Review com Diffs',
      'description', 'Tela final de review destacando alterações feitas (diffs). Especialmente importante para edições de dados críticos.'
    ),
    jsonb_build_object(
      'title', 'Biometria Reforçada',
      'description', 'Face/Touch ID ou BiometricPrompt com fallback de PIN para ações críticas.'
    )
  )
WHERE quadrant_id = (SELECT id FROM quadrants WHERE code = 'Q4')
  AND section_type = 'interactions';

-- ================================================
-- 2. ENRIQUECER LAYERS_CONFIG COM ORIENTAÇÕES DETALHADAS
-- ================================================

-- RISCO - BAIXO
UPDATE layers_config
SET 
  ux_guidance = 'Otimizar ritmo e fluência. Confirmar apenas quando retorno é custoso ou não-reversível. Implementar swipe para ações rápidas. Priorizar memória muscular através de posições consistentes.',
  validation_guidance = 'Validação leve e inline. Undo amplo (5-10s) através de snackbar. Foco em facilitar correção rápida. Exemplos: arquivar notificação, favoritar atalho, marcar como lida.',
  copy_guidance = 'Copy direta e focada em ação. Evitar "Tem certeza?" desnecessário em ações reversíveis. Focar no resultado: "Arquivado", "Favoritado". Tom neutro e objetivo.',
  measurement_guidance = 'Medir taxa de undo para detectar problemas de usabilidade. Erros silenciosos toleráveis se facilmente reversíveis. Monitorar repetições excessivas como sinal de UX ruim.'
WHERE layer_type = 'risk' AND level = 'baixo';

-- RISCO - MÉDIO
UPDATE layers_config
SET 
  ux_guidance = 'Confirmar mudanças estruturais que afetam múltiplos pontos do sistema. Destacar visualmente campos críticos. Exemplo: editar limite diário, cancelar agendamento que já notificou terceiros.',
  validation_guidance = 'Checagens de consistência entre 2-3 campos relacionados. Validar impacto antes de confirmar. Exemplo: "Alterar este limite afeta também X e Y".',
  copy_guidance = 'Explicitar relação causa-efeito: "Você está alterando X; isso afeta Y". Usar tom informativo mas não alarmista. Dar contexto suficiente para decisão consciente.',
  measurement_guidance = 'Rastrear incidentes por 1.000 ações. Medir tempo extra por confirmação (se muito alto, revisar UX). Monitorar chamados de suporte relacionados.'
WHERE layer_type = 'risk' AND level = 'médio';

-- RISCO - ALTO
UPDATE layers_config
SET 
  ux_guidance = 'Confirmação explícita em múltiplas etapas. Autenticação reforçada (biometria + PIN). Review final com diffs destacando exatamente o que mudará. Double-entry para valores críticos (usuário digita duas vezes). Exemplos: encerrar conta, contratar empréstimo, transferência internacional.',
  validation_guidance = 'Regras preventivas rigorosas. Simulação determinística mostrando resultado exato antes de executar. Double-entry (repetir valor crítico para confirmação). Zero tolerância para falhas catastróficas.',
  copy_guidance = 'Explicitar consequências e reversibilidade: "Irreversível", "Estorna até 30 min", "Não pode ser desfeito". Usar linguagem clara sobre riscos sem causar pânico. Mostrar prazo e condições de reversão quando aplicável.',
  measurement_guidance = 'Meta: zero falhas catastróficas. Monitorar near-miss (quase-erros salvos por validação). Medir tempo até confirmação (muito rápido pode indicar descuido). Análise detalhada de cada incidente.'
WHERE layer_type = 'risk' AND level = 'alto';

-- INCERTEZA - BAIXA
UPDATE layers_config
SET 
  ux_guidance = 'Ajuda on-demand, escondida por padrão (não poluir interface). Empty states úteis com sugestões concretas. Usuário já conhece o domínio.',
  validation_guidance = 'Mensagens curtas e diretas. Sugestões suaves sem soar condescendente.',
  copy_guidance = 'Foco no resultado, sem explicar o "porquê". Usuário experiente não precisa de contexto extra.',
  measurement_guidance = 'Taxa de uso de ajuda deve ser baixa. Se alta, revisar se público-alvo está correto ou se UI não está clara.'
WHERE layer_type = 'uncertainty' AND level = 'baixa';

-- INCERTEZA - MÉDIA
UPDATE layers_config
SET 
  ux_guidance = 'Micro-tutorial de 1 slide no primeiro uso. Prévias (antes/depois) do efeito de uma ação. Tooltips contextuais acionáveis.',
  validation_guidance = 'Confirmar regras implícitas que podem surpreender: "Débito no fim de semana vai para dia útil". Antecipar dúvidas comuns.',
  copy_guidance = 'Explicar o porquê em 1 linha concisa. Exemplo: "Verificação previne fraude". Tom educativo mas respeitoso.',
  measurement_guidance = 'Medir cliques em tooltips de ajuda. Tempo na seção pode indicar dificuldade de compreensão. Taxa de correção após preview.'
WHERE layer_type = 'uncertainty' AND level = 'média';

-- INCERTEZA - ALTA
UPDATE layers_config
SET 
  ux_guidance = 'Ajuda contextual robusta sempre visível. Histórico das últimas escolhas para comparação. Mini-simulação determinística mostrando impacto. Botão "Ver impacto" sem sair da tela. Exemplo: adequação de perfil de investidor.',
  validation_guidance = 'Explicações vinculadas ao erro: "Falhou porque X>Y, tente reduzir X ou aumentar Y". Guidance preditivo antes do erro.',
  copy_guidance = 'Perguntas guiadas com roteiros fixos (sem LLM): "Qual é sua meta de prazo?", "Você pode esperar quantos dias?". Tom de parceiro, não de expert distante.',
  measurement_guidance = 'Cliques em ajuda, tempo na seção, mudanças após prévia são KPIs principais. Taxa de abandono alto indica necessidade de simplificar.'
WHERE layer_type = 'uncertainty' AND level = 'alta';

-- URGÊNCIA - BAIXA
UPDATE layers_config
SET 
  ux_guidance = 'Hierarquia padrão sem pressão. Espaço suficiente para leitura confortável. Não otimizar para velocidade às custas de clareza.',
  validation_guidance = 'Sem pressa. Foco em exatidão sobre rapidez. Validações podem ser mais verbosas.',
  copy_guidance = 'Calma e neutra. Pode ser mais descritiva e educativa. Tom tranquilo.',
  measurement_guidance = 'Taxa de conclusão e acurácia são mais importantes que velocidade. Monitorar compreensão.'
WHERE layer_type = 'urgency' AND level = 'baixa';

-- URGÊNCIA - MÉDIA
UPDATE layers_config
SET 
  ux_guidance = 'Atalhos e autocomplete agressivo. Priorizar itens frequentes no topo. CTA sticky (sempre visível). Reduzir passos sem sacrificar segurança.',
  validation_guidance = 'Feedback rápido (inline, não modal). 1 clique para corrigir erro. Validar enquanto usuário digita quando possível.',
  copy_guidance = 'Objetiva e direta: "Pronto em segundos", "Confirmado". Evitar textos longos. Usar indicadores visuais.',
  measurement_guidance = 'Time-to-Success (TTS) é KPI principal. Medir steps até conclusão. Taxa de uso de atalhos indica eficácia.'
WHERE layer_type = 'urgency' AND level = 'média';

-- URGÊNCIA - ALTA
UPDATE layers_config
SET 
  ux_guidance = 'Modo Rápido com defaults seguros. Confirmação pós-ação quando reversível (não pré). Encontrabilidade ≤2s via busca/atalhos. CTA em máximo destaque. Indicadores claros de estado e latência. Exemplo: pagamento urgente, suporte crítico.',
  validation_guidance = 'Antecipar erros. Fallback offline com fila de retentativa automática. Validações não podem bloquear urgência excessivamente.',
  copy_guidance = 'Enxuta ao máximo. Estado do sistema sempre visível: "Enviado", "Em processamento", "Fila: 2 min". Tom tranquilizador em meio à urgência.',
  measurement_guidance = 'TTS e abandono nos primeiros 10s são críticos. Medir degradação em redes lentas (3G). Taxa de uso de modo offline/fila.'
WHERE layer_type = 'urgency' AND level = 'alta';

-- ================================================
-- 3. ENRIQUECER DESCRIÇÕES DOS PADRÕES BASE
-- ================================================

-- Q1 - Atalhos de Valor
UPDATE quadrant_patterns
SET description = 'Ofereça os 3 valores mais usados como botões rápidos (ex: R$ 50/100/200) com tap direto. Adicione chip "Outro valor" para casos excepcionais. Reduz fricção ao mínimo para ações rotineiras de pagamento, recarga, transferência.'
WHERE quadrant_id = (SELECT id FROM quadrants WHERE code = 'Q1')
  AND name = 'Atalhos de Valor';

-- Q1 - Favoritos Persistentes
UPDATE quadrant_patterns
SET description = 'Liste os 3-5 destinatários/ações mais frequentes com acesso em 1 tap. Mantenha posição estável para criar memória muscular. Permita edição fácil da lista. Exemplo: favoritos Pix sempre no topo da tela de pagamento.'
WHERE quadrant_id = (SELECT id FROM quadrants WHERE code = 'Q1')
  AND name = 'Favoritos Persistentes';

-- Q1 - Swipe Actions  
UPDATE quadrant_patterns
SET description = 'Implemente gestos de swipe em listas para ações rápidas: esquerda para "Pagar/Arquivar", direita para "Favoritar". Feedback tátil leve ao completar gesto. Confirmar apenas se Risco ≥ Médio. Use cores consistentes: verde=confirmar, vermelho=deletar, amarelo=arquivar.'
WHERE quadrant_id = (SELECT id FROM quadrants WHERE code = 'Q1')
  AND name = 'Swipe Actions';

-- Q2 - Filtros Facetados
UPDATE quadrant_patterns
SET description = 'Implemente filtros com contadores por categoria (ex: "Pix (23)", "Boleto (5)"). Mostre chips removíveis para filtros ativos. Combine com busca. Mantenha sempre visível quantos itens resultaram. Permita salvar combinações de filtros como "vistas" para reuso.'
WHERE quadrant_id = (SELECT id FROM quadrants WHERE code = 'Q2')
  AND name LIKE '%Filtros%';

-- Q2 - Overview + Detail
UPDATE quadrant_patterns
SET description = 'Estruture tela com painel resumo (KPIs, alertas, totais) no topo + lista/tabela principal detalhada abaixo. Usuário vê contexto antes de mergulhar nos detalhes. Use sticky header para manter resumo visível durante scroll. Exemplo: Home bancária com saldos + lista de transações.'
WHERE quadrant_id = (SELECT id FROM quadrants WHERE code = 'Q2')
  AND name LIKE '%Overview%';

-- Q3 - Step-by-Step
UPDATE quadrant_patterns
SET description = 'Divida fluxo em 2-3 passos máximo, uma decisão clara por tela. Mostre indicador de progresso simples (ex: "Passo 2 de 3"). Botões Voltar/Avançar em posições consistentes. Review final antes de submeter. Exemplo: "Cadastrar recebedor" → Nome/CPF → Chave → Review → Confirmar.'
WHERE quadrant_id = (SELECT id FROM quadrants WHERE code = 'Q3')
  AND name LIKE '%Step%' OR name LIKE '%Passo%';

-- Q3 - Validação Inline
UPDATE quadrant_patterns
SET description = 'Valide campo ao sair dele (onBlur), não ao submeter formulário. Mostre ícone de sucesso/erro + mensagem curta e acionável. Use cores consistentes e aria-live para acessibilidade. Permita correção sem perder resto do formulário. Exemplo: validar CPF e mostrar "CPF inválido. Verificar dígitos." imediatamente.'
WHERE quadrant_id = (SELECT id FROM quadrants WHERE code = 'Q3')
  AND name LIKE '%Validação%' OR name LIKE '%Inline%';

-- Q4 - Resumo Fixo com Diffs
UPDATE quadrant_patterns
SET description = 'Mantenha painel de resumo sempre visível (sticky top ou sheet colapsável) mostrando valores calculados em tempo real. Na revisão final, destaque diffs: o que mudou em relação ao estado anterior. Use cores: verde=novo, amarelo=alterado, vermelho=removido. Exemplo: contratação de empréstimo mostrando valor, prazo, juros, IOF em resumo fixo.'
WHERE quadrant_id = (SELECT id FROM quadrants WHERE code = 'Q4')
  AND name LIKE '%Resumo%' OR name LIKE '%Diff%';

-- Q4 - Autosave
UPDATE quadrant_patterns
SET description = 'Salve automaticamente a cada campo preenchido ou a cada 30s de inatividade. Mostre indicador discreto "Rascunho salvo às 14:35". Implemente deep links para retomar de onde parou. Nunca dependa de único botão "Salvar". Exemplo: formulário de empréstimo salva progresso automaticamente, permite retomar em outro dispositivo.'
WHERE quadrant_id = (SELECT id FROM quadrants WHERE code = 'Q4')
  AND name LIKE '%Autosave%' OR name LIKE '%Rascunho%';