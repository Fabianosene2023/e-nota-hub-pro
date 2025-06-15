
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Save, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNotasFiscais } from '@/hooks/useNotasFiscais';
import { toast } from '@/hooks/use-toast';

export const NfeAjusteForm: React.FC = () => {
  const [chaveAcesso, setChaveAcesso] = useState('');
  const [notaEncontrada, setNotaEncontrada] = useState<any>(null);
  const [tipoAjuste, setTipoAjuste] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [valorOriginal, setValorOriginal] = useState('');
  const [valorCorrigido, setValorCorrigido] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: notasFiscais } = useNotasFiscais();

  const handleBuscarNota = () => {
    if (!chaveAcesso || chaveAcesso.length !== 44) {
      toast({
        title: "Erro",
        description: "Chave de acesso deve ter 44 dígitos",
        variant: "destructive",
      });
      return;
    }

    const nota = notasFiscais?.find(n => n.chave_acesso === chaveAcesso);
    if (nota) {
      setNotaEncontrada(nota);
      toast({
        title: "Nota encontrada",
        description: `NFe ${nota.numero} - Série ${nota.serie}`,
      });
    } else {
      toast({
        title: "Nota não encontrada",
        description: "Verifique a chave de acesso informada",
        variant: "destructive",
      });
      setNotaEncontrada(null);
    }
  };

  const handleSubmitAjuste = async () => {
    if (!notaEncontrada || !tipoAjuste || !justificativa) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    if (justificativa.length < 15) {
      toast({
        title: "Erro",
        description: "Justificativa deve ter pelo menos 15 caracteres",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simular processamento do ajuste
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Ajuste realizado com sucesso",
        description: "O ajuste da NFe foi processado e registrado",
      });

      // Limpar formulário
      setChaveAcesso('');
      setNotaEncontrada(null);
      setTipoAjuste('');
      setJustificativa('');
      setValorOriginal('');
      setValorCorrigido('');
    } catch (error) {
      toast({
        title: "Erro no ajuste",
        description: "Não foi possível processar o ajuste da NFe",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Busca da NFe */}
      <Card>
        <CardHeader>
          <CardTitle>Localizar NFe</CardTitle>
          <CardDescription>
            Informe a chave de acesso da NFe que deseja ajustar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="chave_acesso">Chave de Acesso (44 dígitos)</Label>
              <Input
                id="chave_acesso"
                value={chaveAcesso}
                onChange={(e) => setChaveAcesso(e.target.value.replace(/\D/g, ''))}
                placeholder="Digite a chave de acesso da NFe"
                maxLength={44}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleBuscarNota}
                disabled={chaveAcesso.length !== 44}
              >
                <Search className="mr-2 h-4 w-4" />
                Buscar
              </Button>
            </div>
          </div>

          {notaEncontrada && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>NFe Encontrada:</strong> Número {notaEncontrada.numero} - Série {notaEncontrada.serie} | 
                Valor: R$ {notaEncontrada.valor_total?.toFixed(2)} | 
                Status: {notaEncontrada.status}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Formulário de Ajuste */}
      {notaEncontrada && (
        <Card>
          <CardHeader>
            <CardTitle>Dados do Ajuste</CardTitle>
            <CardDescription>
              Preencha as informações do ajuste a ser realizado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo_ajuste">Tipo de Ajuste</Label>
                <Select value={tipoAjuste} onValueChange={setTipoAjuste}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de ajuste" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="correcao_valor">Correção de Valor</SelectItem>
                    <SelectItem value="correcao_dados">Correção de Dados do Destinatário</SelectItem>
                    <SelectItem value="correcao_produto">Correção de Dados do Produto</SelectItem>
                    <SelectItem value="correcao_tributaria">Correção Tributária</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {tipoAjuste === 'correcao_valor' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valor_original">Valor Original (R$)</Label>
                  <Input
                    id="valor_original"
                    type="number"
                    step="0.01"
                    value={valorOriginal}
                    onChange={(e) => setValorOriginal(e.target.value)}
                    placeholder="0,00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor_corrigido">Valor Corrigido (R$)</Label>
                  <Input
                    id="valor_corrigido"
                    type="number"
                    step="0.01"
                    value={valorCorrigido}
                    onChange={(e) => setValorCorrigido(e.target.value)}
                    placeholder="0,00"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="justificativa">Justificativa do Ajuste *</Label>
              <Textarea
                id="justificativa"
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
                placeholder="Descreva detalhadamente o motivo do ajuste (mínimo 15 caracteres)"
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                {justificativa.length}/500 caracteres (mínimo 15)
              </p>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Atenção:</strong> O ajuste de NFe é um processo irreversível e será registrado nos 
                sistemas da SEFAZ. Certifique-se de que todas as informações estão corretas antes de prosseguir.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-4">
              <Button 
                variant="outline"
                onClick={() => {
                  setNotaEncontrada(null);
                  setChaveAcesso('');
                  setTipoAjuste('');
                  setJustificativa('');
                  setValorOriginal('');
                  setValorCorrigido('');
                }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmitAjuste}
                disabled={isProcessing || !tipoAjuste || !justificativa || justificativa.length < 15}
                className="min-w-[150px]"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Realizar Ajuste
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
