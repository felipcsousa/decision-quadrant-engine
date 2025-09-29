-- Corrigir o search_path da função update_updated_at_column
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

-- Recriar os triggers
CREATE TRIGGER update_quadrants_updated_at BEFORE UPDATE ON public.quadrants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quadrant_patterns_updated_at BEFORE UPDATE ON public.quadrant_patterns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quadrant_detailed_sections_updated_at BEFORE UPDATE ON public.quadrant_detailed_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guardrails_updated_at BEFORE UPDATE ON public.guardrails
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_layers_config_updated_at BEFORE UPDATE ON public.layers_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pattern_refinements_updated_at BEFORE UPDATE ON public.pattern_refinements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_suggestion_templates_updated_at BEFORE UPDATE ON public.suggestion_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_checklist_items_updated_at BEFORE UPDATE ON public.checklist_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transversal_recommendations_updated_at BEFORE UPDATE ON public.transversal_recommendations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_analyses_updated_at BEFORE UPDATE ON public.user_analyses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();