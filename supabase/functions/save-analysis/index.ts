import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  id?: string;
  definition: {
    name: string;
    description: string;
    jtbd: string;
  };
  diagnostic: {
    frequency: number;
    information: number;
    frequencyDir?: 'baixo' | 'alto';
    informationDir?: 'baixo' | 'alto';
    frequencyEvidence?: string;
    informationEvidence?: string;
  };
  layers: {
    risk: 'baixo' | 'médio' | 'alto';
    uncertainty: 'baixa' | 'média' | 'alta';
    urgency: 'baixa' | 'média' | 'alta';
    collaboration?: 'solo' | 'multi';
  };
  quadrant: string | null;
  aiSuggestionsGenerated?: boolean;
  completed?: boolean;
}

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

    const body: RequestBody = await req.json();
    console.log('Saving analysis for user:', user.id, body.id ? '(update)' : '(new)');

    const analysisData = {
      user_id: user.id,
      name: body.definition.name,
      description: body.definition.description,
      jtbd: body.definition.jtbd,
      quadrant_code: body.quadrant,
      frequency: body.diagnostic.frequency,
      information: body.diagnostic.information,
      frequency_direction: body.diagnostic.frequencyDir || null,
      information_direction: body.diagnostic.informationDir || null,
      frequency_evidence: body.diagnostic.frequencyEvidence || null,
      information_evidence: body.diagnostic.informationEvidence || null,
      risk_level: body.layers.risk,
      uncertainty_level: body.layers.uncertainty,
      urgency_level: body.layers.urgency,
      collaboration_level: body.layers.collaboration || null,
      ai_suggestions_generated: body.aiSuggestionsGenerated || false,
      completed_at: body.completed ? new Date().toISOString() : null,
    };

    let analysisId: string;

    if (body.id) {
      // Update existing analysis
      const { data, error } = await supabase
        .from('user_analyses')
        .update(analysisData)
        .eq('id', body.id)
        .eq('user_id', user.id)
        .select('id')
        .single();

      if (error) throw error;
      analysisId = data.id;
      console.log('Analysis updated:', analysisId);
    } else {
      // Create new analysis
      const { data, error } = await supabase
        .from('user_analyses')
        .insert(analysisData)
        .select('id, created_at')
        .single();

      if (error) throw error;
      analysisId = data.id;
      console.log('Analysis created:', analysisId);
    }

    return new Response(
      JSON.stringify({ id: analysisId, success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in save-analysis:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});