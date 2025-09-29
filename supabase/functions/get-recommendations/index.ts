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

    const { quadrant, layers }: RequestBody = await req.json();
    console.log('Fetching recommendations for:', quadrant, layers);

    // Fetch quadrant info
    const { data: quadrantData, error: quadrantError } = await supabase
      .from('quadrants')
      .select('*')
      .eq('code', quadrant)
      .single();

    if (quadrantError) throw quadrantError;

    // Fetch base patterns
    const { data: basePatterns, error: patternsError } = await supabase
      .from('quadrant_patterns')
      .select('*')
      .eq('quadrant_id', quadrantData.id)
      .eq('active', true)
      .order('display_order');

    if (patternsError) throw patternsError;

    // Fetch detailed sections
    const { data: detailedSections, error: sectionsError } = await supabase
      .from('quadrant_detailed_sections')
      .select('*')
      .eq('quadrant_id', quadrantData.id)
      .eq('active', true)
      .order('display_order');

    if (sectionsError) throw sectionsError;

    // Fetch guardrails
    const { data: guardrails, error: guardrailsError } = await supabase
      .from('guardrails')
      .select('*')
      .eq('quadrant_id', quadrantData.id)
      .eq('active', true)
      .order('display_order');

    if (guardrailsError) throw guardrailsError;

    // Fetch layer-specific refinements
    const { data: refinements, error: refinementsError } = await supabase
      .from('pattern_refinements')
      .select('*')
      .eq('active', true)
      .or(`layer_type.eq.risk,layer_type.eq.uncertainty,layer_type.eq.urgency`);

    if (refinementsError) throw refinementsError;

    // Filter refinements by layers
    const filteredRefinements = refinements?.filter(r => {
      if (r.layer_type === 'risk' && r.level === layers.risk) return true;
      if (r.layer_type === 'uncertainty' && r.level === layers.uncertainty) return true;
      if (r.layer_type === 'urgency' && r.level === layers.urgency) return true;
      return false;
    }) || [];

    // Fetch layer details
    const { data: layerDetails, error: layerDetailsError } = await supabase
      .from('layers_config')
      .select('*')
      .or(`layer_type.eq.risk,layer_type.eq.uncertainty,layer_type.eq.urgency`);

    if (layerDetailsError) throw layerDetailsError;

    // Organize layer details by type and level
    const layerDetailsMap: any = {
      risk: {},
      uncertainty: {},
      urgency: {}
    };
    layerDetails?.forEach(detail => {
      layerDetailsMap[detail.layer_type][detail.level] = {
        ux: detail.ux_guidance,
        validation: detail.validation_guidance,
        copy: detail.copy_guidance,
        measurement: detail.measurement_guidance
      };
    });

    // Fetch checklist items
    const { data: checklist, error: checklistError } = await supabase
      .from('checklist_items')
      .select('*')
      .eq('active', true)
      .order('display_order');

    if (checklistError) throw checklistError;

    // Fetch transversal recommendations
    const { data: transversal, error: transversalError } = await supabase
      .from('transversal_recommendations')
      .select('*')
      .eq('active', true)
      .order('display_order');

    if (transversalError) throw transversalError;

    const response = {
      quadrantInfo: {
        name: quadrantData.name,
        archetype: quadrantData.archetype,
        guideline: quadrantData.guideline,
        description: quadrantData.description
      },
      basePatterns: basePatterns?.map(p => ({
        name: p.name,
        description: p.description,
        category: p.category,
        priority: p.priority
      })) || [],
      detailedSections: detailedSections?.map(s => ({
        type: s.section_type,
        title: s.title,
        objective: s.objective,
        items: s.items,
        checklistItems: s.checklist_items,
        antiPatterns: s.anti_patterns
      })) || [],
      refinedPatterns: filteredRefinements.map(r => ({
        name: r.name,
        description: r.description,
        category: r.category,
        priority: r.priority
      })),
      guardrails: guardrails?.map(g => ({
        metric: g.metric_name,
        target: g.target_value,
        description: g.description,
        range: g.range_value
      })) || [],
      layerDetails: {
        risk: layerDetailsMap.risk[layers.risk],
        uncertainty: layerDetailsMap.uncertainty[layers.uncertainty],
        urgency: layerDetailsMap.urgency[layers.urgency]
      },
      checklist: checklist?.map(c => ({
        category: c.category,
        item: c.item,
        description: c.description,
        status: 'pending'
      })) || [],
      transversalRecommendations: transversal?.map(t => t.recommendation) || []
    };

    console.log('Successfully fetched recommendations');

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-recommendations:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});