import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { ArrowLeft, Clock, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Analysis {
  id: string;
  name: string;
  quadrant_code: string;
  created_at: string;
  completed_at: string | null;
  updated_at: string;
}

export default function AnalysisHistory() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { loadAnalysis } = useAnalysis();
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalyses();
  }, []);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-user-analyses', {
        body: { limit: 50, offset: 0 }
      });

      if (error) throw error;

      setAnalyses(data.analyses || []);
    } catch (error) {
      console.error('Error fetching analyses:', error);
      toast({
        title: 'Erro ao carregar histórico',
        description: 'Não foi possível carregar suas análises',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadAnalysis = async (id: string) => {
    try {
      await loadAnalysis(id);
      navigate('/');
    } catch (error) {
      console.error('Error loading analysis:', error);
    }
  };

  const getQuadrantColor = (quadrant: string) => {
    const colors: Record<string, string> = {
      'Q1': 'bg-q1',
      'Q2': 'bg-q2',
      'Q3': 'bg-q3',
      'Q4': 'bg-q4'
    };
    return colors[quadrant] || 'bg-muted';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            
            <h1 className="text-4xl font-bold text-text-primary mb-2">
              Minhas Análises
            </h1>
            <p className="text-text-secondary text-lg">
              Histórico de todas as suas análises UX
            </p>
          </div>

          {analyses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Nenhuma análise encontrada
                </h3>
                <p className="text-text-secondary mb-6">
                  Comece criando sua primeira análise UX
                </p>
                <Button onClick={() => navigate('/')}>
                  Nova Análise
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <Card
                  key={analysis.id}
                  className="cursor-pointer hover:shadow-md transition-all border-border/50"
                  onClick={() => handleLoadAnalysis(analysis.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`w-3 h-3 rounded-full ${getQuadrantColor(
                              analysis.quadrant_code
                            )}`}
                          />
                          <CardTitle className="text-xl font-semibold text-text-primary">
                            {analysis.name}
                          </CardTitle>
                        </div>
                        <CardDescription className="flex items-center gap-4 text-text-secondary">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(analysis.created_at)}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {analysis.quadrant_code}
                        </Badge>
                        {analysis.completed_at && (
                          <Badge variant="default" className="text-xs">
                            Completa
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}