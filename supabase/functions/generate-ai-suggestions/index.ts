import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  quadrant: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  layers: {
    risk: string;
    uncertainty: string;
    urgency: string;
  };
  definition: {
    name: string;
    description: string;
    jtbd: string;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { quadrant, layers, definition }: RequestBody = await req.json();
    console.log('Generating AI suggestions for:', quadrant, definition.name);

    // Infer task type from definition text
    const text = `${definition.name} ${definition.description} ${definition.jtbd}`.toLowerCase();
    let taskType = 'general';
    
    if (text.includes('pagamento') || text.includes('pagar') || text.includes('transferência') || text.includes('pix')) {
      taskType = 'financial';
    } else if (text.includes('compra') || text.includes('carrinho') || text.includes('produto') || text.includes('checkout')) {
      taskType = 'commerce';
    } else if (text.includes('cadastro') || text.includes('perfil') || text.includes('conta') || text.includes('registro')) {
      taskType = 'onboarding';
    } else if (text.includes('consulta') || text.includes('relatório') || text.includes('extrato') || text.includes('histórico')) {
      taskType = 'analytics';
    } else if (text.includes('configuração') || text.includes('ajuste') || text.includes('preferência')) {
      taskType = 'settings';
    }

    // Infer user profile
    let userProfile = 'consumer';
    if (text.includes('profissional') || text.includes('empresa') || text.includes('corporativo')) {
      userProfile = 'business';
    } else if (text.includes('idoso') || text.includes('acessibilidade') || text.includes('simples')) {
      userProfile = 'accessibility';
    } else if (text.includes('móvel') || text.includes('celular') || text.includes('rápido')) {
      userProfile = 'mobile';
    }

    console.log('Inferred context:', { taskType, userProfile });

    // Fetch quadrant ID
    const { data: quadrantData, error: quadrantError } = await supabase
      .from('quadrants')
      .select('id')
      .eq('code', quadrant)
      .single();

    if (quadrantError) throw quadrantError;

    // Fetch suggestion templates
    const { data: suggestions, error: suggestionsError } = await supabase
      .from('suggestion_templates')
      .select('*')
      .or(`quadrant_id.eq.${quadrantData.id},quadrant_id.is.null`)
      .eq('active', true);

    if (suggestionsError) throw suggestionsError;

    console.log(`Found ${suggestions?.length || 0} suggestion templates`);

    // Filter and score suggestions
    const scoredSuggestions = (suggestions || []).map(s => {
      let score = 0;
      
      // Match trigger context
      if (s.trigger_context === 'task_type' && s.trigger_value === taskType) score += 3;
      if (s.trigger_context === 'user_profile' && s.trigger_value === userProfile) score += 3;
      if (s.trigger_context === 'jtbd_keyword' && definition.jtbd.toLowerCase().includes(s.trigger_value.toLowerCase())) score += 2;
      
      // Match layers
      if (s.applies_to_risk === layers.risk) score += 1;
      if (s.applies_to_uncertainty === layers.uncertainty) score += 1;
      if (s.applies_to_urgency === layers.urgency) score += 1;
      
      // Quadrant match
      if (s.quadrant_id === quadrantData.id) score += 2;
      
      return { ...s, score };
    });

    // Sort by score and priority
    const priorityOrder: Record<string, number> = { essential: 0, high: 1, medium: 2, low: 3 };
    const filteredSuggestions = scoredSuggestions
      .filter(s => s.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      })
      .slice(0, 8);

    console.log(`Returning ${filteredSuggestions.length} filtered suggestions`);

    const response = {
      suggestions: filteredSuggestions.map(s => ({
        title: s.title,
        description: s.description,
        rationale: s.rationale,
        priority: s.priority,
        category: s.category
      }))
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-ai-suggestions:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});