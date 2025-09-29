import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { id: analysisId } = await req.json();

    if (!analysisId) {
      throw new Error('Missing analysis ID');
    }

    console.log('Fetching analysis detail:', analysisId);

    // Fetch analysis
    const { data: analysis, error: analysisError } = await supabase
      .from('user_analyses')
      .select('*')
      .eq('id', analysisId)
      .eq('user_id', user.id)
      .single();

    if (analysisError) throw analysisError;
    if (!analysis) throw new Error('Analysis not found');

    // Fetch AI suggestions if generated
    let aiSuggestions = [];
    if (analysis.ai_suggestions_generated) {
      const { data: suggestions, error: suggestionsError } = await supabase
        .from('analysis_ai_suggestions')
        .select('*')
        .eq('analysis_id', analysisId)
        .order('display_order');

      if (suggestionsError) {
        console.error('Error fetching AI suggestions:', suggestionsError);
      } else {
        aiSuggestions = suggestions || [];
      }
    }

    console.log('Analysis found with', aiSuggestions.length, 'AI suggestions');

    const response = {
      analysis: {
        id: analysis.id,
        name: analysis.name,
        description: analysis.description,
        jtbd: analysis.jtbd,
        quadrant: analysis.quadrant_code,
        frequency: analysis.frequency,
        information: analysis.information,
        frequencyDir: analysis.frequency_direction,
        informationDir: analysis.information_direction,
        frequencyEvidence: analysis.frequency_evidence,
        informationEvidence: analysis.information_evidence,
        risk: analysis.risk_level,
        uncertainty: analysis.uncertainty_level,
        urgency: analysis.urgency_level,
        collaboration: analysis.collaboration_level,
        aiSuggestionsGenerated: analysis.ai_suggestions_generated,
        completedAt: analysis.completed_at,
        createdAt: analysis.created_at,
        updatedAt: analysis.updated_at
      },
      aiSuggestions: aiSuggestions.map(s => ({
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
    console.error('Error in get-analysis-detail:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});