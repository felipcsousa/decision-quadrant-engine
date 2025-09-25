import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function DefinitionStep() {
  const { state, updateDefinition, nextStep, previousStep } = useAnalysis();

  const isFormValid = state.definition.name.trim() && 
                     state.definition.description.trim() && 
                     state.definition.jtbd.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-text-primary mb-4">
              Definição da Tarefa
            </h1>
            <p className="text-lg text-text-secondary">
              Descreva o que o usuário precisa fazer e por quê
            </p>
          </div>

          {/* Form */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-text-primary">
                O quê e por quê
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-text-primary">
                    Nome da Tarefa *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Ex: Pagamento via Pix"
                    value={state.definition.name}
                    onChange={(e) => updateDefinition({ name: e.target.value })}
                    className="border-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-text-primary">
                    Descrição *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva brevemente o que o usuário faz nesta tarefa..."
                    value={state.definition.description}
                    onChange={(e) => updateDefinition({ description: e.target.value })}
                    className="border-input min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jtbd" className="text-sm font-medium text-text-primary">
                    Job to Be Done (JTBD) *
                  </Label>
                  <Textarea
                    id="jtbd"
                    placeholder="Quando [situação], eu quero [motivação] para que [resultado esperado]..."
                    value={state.definition.jtbd}
                    onChange={(e) => updateDefinition({ jtbd: e.target.value })}
                    className="border-input min-h-[100px]"
                  />
                  <p className="text-xs text-text-tertiary">
                    Descreva a motivação e contexto do usuário
                  </p>
                </div>

                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={previousStep}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                  </Button>
                  
                  <Button
                    type="submit"
                    disabled={!isFormValid}
                    className="flex items-center gap-2 bg-gradient-primary text-white"
                  >
                    Ir para Diagnóstico
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}