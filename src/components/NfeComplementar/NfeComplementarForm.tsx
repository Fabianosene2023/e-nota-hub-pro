
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Save, AlertTriangle, FileText } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNotasFiscais } from '@/hooks/useNotasFiscais';
import { toast } from '@/hooks/use-toast';

export const NfeComplementarForm: React.FC = () => {
  const [chaveAcesso, setChaveAcesso] = useState('');
  const [notaOriginal, setNotaOriginal] = useState<any>(null);
  const [tipoComplemento, setTipoComplemento] = useState('');
  const [valorOriginal, setValorOriginal] = useState('');
  const [valorComplementar, setValorComplementar] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [observacoes, setObservacoes] = useState('');
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
      if (nota.status !== 'autorizada') {
        toast({
          title: "Erro",
          description: "Só é possível complementar notas autorizadas",
          variant: "destructive",
        });
        return;
      }

      setNotaOriginal(nota);
      setValorOriginal(nota.valor_total?.toString() || '');
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
      setNotaOriginal(null);
    }
  };

  const calcularValorTotal = () => {
    const original = parseFloat(valorOriginal) || 0;
    const complementar = parseFloat(valorComplementar) || 0;
    return original + complementar;
  };

  const handleSubmitComplementar = async () => {
    if (!notaOriginal || !tipoComplemento || !valorComplementar || !justificativa) {
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

    const valorCompl = parseFloat(valorComplementar);
    if (valorCompl <= 0) {
      toast({
        title: "Erro",
        description: "Valor complementar deve ser maior que zero",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Simular processamento da NFe complementar
      await new Promise(resolve => setTimeout(resolve, 3000));

      const chaveComplementar = `${chaveAcesso.slice(0, -8)}${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;

      toast({
        title: "NFe Complementar emitida com sucesso!",
        description: `Chave de acesso: ${chaveComplementar}`,
      });

      // Limpar formulário
      setChaveAcesso('');
      setNotaOriginal(null);
      setTipoComplemento('');
      setValorOriginal('');
      setValorComplementar('');
      setJustificativa('');
      setObservacoes('');
    } catch (error) {
      toast({
        title: "Erro na emissão",
        description: "Não foi possível emitir a NFe complementar",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Busca da NFe Original */}
      <Card>
        <CardHeader>
          <CardTitle>Localizar NFe Original</CardTitle>
          <CardDescription>
            Informe a chave de acesso da NFe que será complementada
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
                placeholder="Digite a chave de acesso da NFe original"
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

          {notaOriginal && (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <strong>NFe Original:</strong> Número {notaOriginal.numero} - Série {notaOriginal.serie} | 
                Valor: R$ {notaOriginal.valor_total?.toFixed(2)} | 
                Cliente: {notaOriginal.cliente?.nome_razao_social || 'N/A'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Formulário de Complemento */}
      {notaOriginal && (
        <Card>
          <CardHeader>
            <CardTitle>Dados do Complemento</CardTitle>
            <CardDescription>
              Preencha as informações da nota fiscal complementar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo_complemento">Tipo de Complemento *</Label>
                <Select value={tipoComplemento} onValueChange={setTipoComplemento}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de complemento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="valor">Complemento de Valor</SelectItem>
                    <SelectItem value="imposto">Complemento de Imposto</SelectItem>
                    <SelectItem value="preco">Complemento de Preço</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valor_original">Valor Original (R$)</Label>
                <Input
                  id="valor_original"
                  type="number"
                  step="0.01"
                  value={valorOriginal}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor_complementar">Valor Complementar (R$) *</Label>
                <Input
                  id="valor_complementar"
                  type="number"
                  step="0.01"
                  value={valorComplementar}
                  onChange={(e) => setValorComplementar(e.target.value)}
                  placeholder="0,00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor_total">Valor Total (R$)</Label>
                <Input
                  id="valor_total"
                  type="number"
                  step="0.01"
                  value={calcularValorTotal().toFixed(2)}
                  disabled
                  className="bg-gray-100 font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="justificativa">Justificativa do Complemento *</Label>
              <Textarea
                id="justificativa"
                value={justificativa}
                onChange={(e) => setJustificativa(e.target.value)}
                placeholder="Descreva detalhadamente o motivo do complemento (mínimo 15 caracteres)"
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                {justificativa.length}/500 caracteres (mínimo 15)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações Adicionais</Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações adicionais para a nota complementar"
                rows={3}
              />
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Atenção:</strong> A NFe complementar será vinculada à nota original e 
                enviada automaticamente para a SEFAZ. Verifique todos os dados antes de prosseguir.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-4">
              <Button 
                variant="outline"
                onClick={() => {
                  setNotaOriginal(null);
                  setChaveAcesso('');
                  setTipoComplemento('');
                  setValorOriginal('');
                  setValorComplementar('');
                  setJustificativa('');
                  setObservacoes('');
                }}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmitComplementar}
                disabled={isProcessing || !tipoComplemento || !valorComplementar || !justificativa || justificativa.length < 15}
                className="min-w-[150px]"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Emitindo...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Emitir NFe Complementar
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
