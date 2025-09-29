-- =====================================================
-- FASE 1: TABELAS DE CONTEÚDO (Recomendações UX)
-- =====================================================

-- Tabela base dos quadrantes
CREATE TABLE IF NOT EXISTS public.quadrants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE CHECK (code IN ('Q1', 'Q2', 'Q3', 'Q4')),
  name TEXT NOT NULL,
  archetype TEXT NOT NULL,
  guideline TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Padrões base por quadrante
CREATE TABLE IF NOT EXISTS public.quadrant_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quadrant_id UUID NOT NULL REFERENCES public.quadrants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'base',
  priority TEXT CHECK (priority IN ('essential', 'high', 'medium', 'low')),
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Seções detalhadas (Layout, Interações, Estados, Microtexto)
CREATE TABLE IF NOT EXISTS public.quadrant_detailed_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quadrant_id UUID NOT NULL REFERENCES public.quadrants(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL CHECK (section_type IN ('layout', 'interactions', 'states', 'microtext')),
  title TEXT NOT NULL,
  objective TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  checklist_items JSONB NOT NULL DEFAULT '[]',
  anti_patterns JSONB NOT NULL DEFAULT '[]',
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Guardrails (KPIs e métricas)
CREATE TABLE IF NOT EXISTS public.guardrails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quadrant_id UUID NOT NULL REFERENCES public.quadrants(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  target_value TEXT NOT NULL,
  description TEXT NOT NULL,
  range_value TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Configuração das camadas (risk, uncertainty, urgency)
CREATE TABLE IF NOT EXISTS public.layers_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layer_type TEXT NOT NULL CHECK (layer_type IN ('risk', 'uncertainty', 'urgency')),
  level TEXT NOT NULL,
  ux_guidance TEXT NOT NULL,
  validation_guidance TEXT NOT NULL,
  copy_guidance TEXT NOT NULL,
  measurement_guidance TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (layer_type, level, version)
);

-- Refinamentos baseados em layers
CREATE TABLE IF NOT EXISTS public.pattern_refinements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layer_type TEXT NOT NULL CHECK (layer_type IN ('risk', 'uncertainty', 'urgency')),
  level TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'refinement',
  priority TEXT CHECK (priority IN ('essential', 'high', 'medium', 'low')),
  active BOOLEAN NOT NULL DEFAULT true,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Templates de sugestões de IA
CREATE TABLE IF NOT EXISTS public.suggestion_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quadrant_id UUID REFERENCES public.quadrants(id) ON DELETE CASCADE,
  trigger_context TEXT NOT NULL CHECK (trigger_context IN ('task_type', 'user_profile', 'jtbd_keyword')),
  trigger_value TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rationale TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('essential', 'high', 'medium', 'low')),
  category TEXT NOT NULL CHECK (category IN ('layout', 'interaction', 'content', 'performance', 'validation')),
  applies_to_risk TEXT,
  applies_to_uncertainty TEXT,
  applies_to_urgency TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Itens do checklist de implementação
CREATE TABLE IF NOT EXISTS public.checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('regra_dos_4', 'estados')),
  item TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Recomendações transversais
CREATE TABLE IF NOT EXISTS public.transversal_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- FASE 2: TABELAS DE ANÁLISES DO USUÁRIO
-- =====================================================

-- Análises criadas pelos usuários
CREATE TABLE IF NOT EXISTS public.user_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  jtbd TEXT NOT NULL,
  quadrant_code TEXT CHECK (quadrant_code IN ('Q1', 'Q2', 'Q3', 'Q4')),
  frequency INTEGER NOT NULL CHECK (frequency BETWEEN 1 AND 5),
  information INTEGER NOT NULL CHECK (information BETWEEN 1 AND 5),
  frequency_direction TEXT CHECK (frequency_direction IN ('baixo', 'alto')),
  information_direction TEXT CHECK (information_direction IN ('baixo', 'alto')),
  frequency_evidence TEXT,
  information_evidence TEXT,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('baixo', 'médio', 'alto')),
  uncertainty_level TEXT NOT NULL CHECK (uncertainty_level IN ('baixa', 'média', 'alta')),
  urgency_level TEXT NOT NULL CHECK (urgency_level IN ('baixa', 'média', 'alta')),
  collaboration_level TEXT CHECK (collaboration_level IN ('solo', 'multi')),
  ai_suggestions_generated BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_user_analyses_user_created ON public.user_analyses(user_id, created_at DESC);

-- Sugestões de IA geradas para cada análise
CREATE TABLE IF NOT EXISTS public.analysis_ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL REFERENCES public.user_analyses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  rationale TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('essential', 'high', 'medium', 'low')),
  category TEXT NOT NULL CHECK (category IN ('layout', 'interaction', 'content', 'performance', 'validation')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.quadrants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quadrant_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quadrant_detailed_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardrails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.layers_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pattern_refinements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestion_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transversal_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_ai_suggestions ENABLE ROW LEVEL SECURITY;

-- Políticas para tabelas de conteúdo (públicas para leitura)
CREATE POLICY "Content tables are viewable by everyone" ON public.quadrants FOR SELECT USING (true);
CREATE POLICY "Content tables are viewable by everyone" ON public.quadrant_patterns FOR SELECT USING (true);
CREATE POLICY "Content tables are viewable by everyone" ON public.quadrant_detailed_sections FOR SELECT USING (true);
CREATE POLICY "Content tables are viewable by everyone" ON public.guardrails FOR SELECT USING (true);
CREATE POLICY "Content tables are viewable by everyone" ON public.layers_config FOR SELECT USING (true);
CREATE POLICY "Content tables are viewable by everyone" ON public.pattern_refinements FOR SELECT USING (true);
CREATE POLICY "Content tables are viewable by everyone" ON public.suggestion_templates FOR SELECT USING (true);
CREATE POLICY "Content tables are viewable by everyone" ON public.checklist_items FOR SELECT USING (true);
CREATE POLICY "Content tables are viewable by everyone" ON public.transversal_recommendations FOR SELECT USING (true);

-- Políticas para análises do usuário (privadas)
CREATE POLICY "Users can view their own analyses" ON public.user_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own analyses" ON public.user_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own analyses" ON public.user_analyses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own analyses" ON public.user_analyses FOR DELETE USING (auth.uid() = user_id);

-- Políticas para sugestões de IA (acesso via análise do usuário)
CREATE POLICY "Users can view AI suggestions for their analyses" ON public.analysis_ai_suggestions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.user_analyses 
    WHERE user_analyses.id = analysis_ai_suggestions.analysis_id 
    AND user_analyses.user_id = auth.uid()
  ));

CREATE POLICY "Users can create AI suggestions for their analyses" ON public.analysis_ai_suggestions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_analyses 
    WHERE user_analyses.id = analysis_ai_suggestions.analysis_id 
    AND user_analyses.user_id = auth.uid()
  ));

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_quadrants_updated_at BEFORE UPDATE ON public.quadrants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quadrant_patterns_updated_at BEFORE UPDATE ON public.quadrant_patterns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_analyses_updated_at BEFORE UPDATE ON public.user_analyses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();