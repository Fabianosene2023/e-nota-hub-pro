
import { useState } from 'react';
import { useEmpresasManager } from '@/hooks/useEmpresasManager';
import { useClientesManager } from '@/hooks/useClientesManager';
import { useProdutos } from '@/hooks/useProdutos';
import { useCreateNotaFiscal } from '@/hooks/useNotasFiscais';
import { useCreateLog } from '@/hooks/useLogsOperacoes';
import { emitirNFe } from '@/utils/integracaoSefaz';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from '@/hooks/use-toast';
import { Loader2, FileText, Plus, Trash2, User, Building } from "lucide-react";

interface ItemNFe {
  produto_id: string;
  produto_nome: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  cfop: string;
}

export const EmissaoNFe = () => {
  const [formData, setFormData] = useState({
    empresa_id: '',
    cliente_id: '',
    numero: '',
    serie: 1,
    natureza_operacao: 'Venda de mercadoria adquirida ou produzida pelo estabelecimento',
    observacoes: '',
    tipo_pessoa: 'juridica' // nova opção para tipo de pessoa
  });
  
  const [itens, setItens] = useState<ItemNFe[]>([]);
  const [itemAtual, setItemAtual] = useState({
    produto_id: '',
    quantidade: 1,
    valor_unitario: 0,
    cfop: '5102'
  });

  // Hooks para carregar dados
  const { data: empresas } = useEmpresasManager();
  const { data: clientes } = useClientesManager(formData.empresa_id);
  const { data: produtos } = useProdutos();
  const createNotaFiscal = useCreateNotaFiscal();
  const createLog = useCreateLog();

  // Filtrar clientes por tipo de pessoa
  const clientesFiltrados = clientes?.filter(cliente => {
    if (formData.tipo_pessoa === 'fisica') {
      return cliente.tipo_pessoa === 'fisica';
    } else {
      return cliente.tipo_pessoa === 'juridica';
    }
  }) || [];

  const adicionarItem = () => {
    if (!itemAtual.produto_id) {
      toast({
        title: "Erro",
        description: "Selecione um produto",
        variant: "destructive",
      });
      return;
    }

    const produto = produtos?.find(p => p.id === itemAtual.produto_id);
    if (!produto) return;

    const valorTotal = itemAtual.quantidade * itemAtual.valor_unitario;
    
    const novoItem: ItemNFe = {
      produto_id: produto.id,
      produto_nome: produto.nome || produto.descricao,
      quantidade: itemAtual.quantidade,
      valor_unitario: itemAtual.valor_unitario,
      valor_total: valorTotal,
      cfop: itemAtual.cfop
    };

    setItens([...itens, novoItem]);
    setItemAtual({
      produto_id: '',
      quantidade: 1,
      valor_unitario: 0,
      cfop: '5102'
    });
  };

  const removerItem = (index: number) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const valorTotalNota = itens.reduce((total, item) => total + item.valor_total, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.empresa_id || !formData.cliente_id || itens.length === 0) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios e adicione pelo menos um item",
        variant: "destructive",
      });
      return;
    }

    try {
      // Preparar dados para emissão
      const dadosNFe = {
        empresa_id: formData.empresa_id,
        cliente_id: formData.cliente_id,
        numero: parseInt(formData.numero),
        serie: formData.serie,
        valor_total: valorTotalNota,
        natureza_operacao: formData.natureza_operacao,
        itens: itens.map(item => ({
          produto_id: item.produto_id,
          quantidade: item.quantidade,
          valor_unitario: item.valor_unitario,
          valor_total: item.valor_total,
          cfop: item.cfop
        })),
        observacoes: formData.observacoes
      };

      // Emitir NFe via SEFAZ (simulado)
      const retornoSefaz = await emitirNFe(dadosNFe);
      
      if (retornoSefaz.success) {
        // Salvar no banco de dados
        const notaData = {
          empresa_id: formData.empresa_id,
          cliente_id: formData.cliente_id,
          numero: parseInt(formData.numero),
          serie: formData.serie,
          valor_total: valorTotalNota,
          natureza_operacao: formData.natureza_operacao,
          observacoes: formData.observacoes,
          chave_acesso: retornoSefaz.chave_acesso,
          protocolo_autorizacao: retornoSefaz.protocolo,
          status: retornoSefaz.status,
          xml_nfe: retornoSefaz.xml_nfe
        };

        await createNotaFiscal.mutateAsync(notaData);
        
        // Registrar log da operação
        await createLog.mutateAsync({
          empresa_id: formData.empresa_id,
          tipo_operacao: 'nfe_emissao',
          descricao: `NFe ${formData.numero} emitida com sucesso`,
          dados_operacao: { chave_acesso: retornoSefaz.chave_acesso, status: retornoSefaz.status }
        });

        // Limpar formulário
        setFormData({
          empresa_id: '',
          cliente_id: '',
          numero: '',
          serie: 1,
          natureza_operacao: 'Venda de mercadoria adquirida ou produzida pelo estabelecimento',
          observacoes: '',
          tipo_pessoa: 'juridica'
        });
        setItens([]);
        
        toast({
          title: "Sucesso!",
          description: `NFe emitida com sucesso. Chave: ${retornoSefaz.chave_acesso}`,
        });
      } else {
        toast({
          title: "Erro na Emissão",
          description: retornoSefaz.motivo || "Erro desconhecido",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao emitir NFe:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar a NFe",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Emissão de NFe</h2>
          <p className="text-muted-foreground">
            Emita notas fiscais eletrônicas com integração SEFAZ
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Gerais */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Gerais</CardTitle>
            <CardDescription>
              Informações básicas da nota fiscal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="empresa">Empresa Emitente *</Label>
                <Select 
                  value={formData.empresa_id} 
                  onValueChange={(value) => setFormData({...formData, empresa_id: value, cliente_id: ''})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas?.map((empresa) => (
                      <SelectItem key={empresa.id} value={empresa.id}>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          {empresa.nome_fantasia || empresa.razao_social}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número *</Label>
                  <Input
                    id="numero"
                    type="number"
                    placeholder="1001"
                    value={formData.numero}
                    onChange={(e) => setFormData({...formData, numero: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serie">Série</Label>
                  <Input
                    id="serie"
                    type="number"
                    value={formData.serie}
                    onChange={(e) => setFormData({...formData, serie: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            {/* Tipo de Pessoa e Cliente */}
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Tipo de Cliente *</Label>
                <RadioGroup
                  value={formData.tipo_pessoa}
                  onValueChange={(value) => setFormData({...formData, tipo_pessoa: value, cliente_id: ''})}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fisica" id="fisica" />
                    <Label htmlFor="fisica" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      Pessoa Física
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="juridica" id="juridica" />
                    <Label htmlFor="juridica" className="flex items-center gap-2 cursor-pointer">
                      <Building className="h-4 w-4" />
                      Pessoa Jurídica
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cliente">
                  {formData.tipo_pessoa === 'fisica' ? 'Cliente (Pessoa Física) *' : 'Cliente (Pessoa Jurídica) *'}
                </Label>
                <Select 
                  value={formData.cliente_id} 
                  onValueChange={(value) => setFormData({...formData, cliente_id: value})}
                  disabled={!formData.empresa_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !formData.empresa_id 
                        ? "Selecione uma empresa primeiro" 
                        : `Selecione o cliente (${formData.tipo_pessoa === 'fisica' ? 'PF' : 'PJ'})`
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {clientesFiltrados?.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        <div className="flex items-center gap-2">
                          {formData.tipo_pessoa === 'fisica' ? 
                            <User className="h-4 w-4" /> : 
                            <Building className="h-4 w-4" />
                          }
                          <div className="flex flex-col">
                            <span>{cliente.nome_razao_social}</span>
                            <span className="text-xs text-muted-foreground">
                              {cliente.cpf_cnpj}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.empresa_id && clientesFiltrados?.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Nenhum cliente do tipo {formData.tipo_pessoa === 'fisica' ? 'pessoa física' : 'pessoa jurídica'} encontrado para esta empresa.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="natureza">Natureza da Operação</Label>
              <Input
                id="natureza"
                value={formData.natureza_operacao}
                onChange={(e) => setFormData({...formData, natureza_operacao: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Itens */}
        <Card>
          <CardHeader>
            <CardTitle>Itens da Nota Fiscal</CardTitle>
            <CardDescription>
              Adicione os produtos/serviços da nota fiscal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Adicionar Item */}
            <div className="grid grid-cols-5 gap-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label>Produto</Label>
                <Select 
                  value={itemAtual.produto_id} 
                  onValueChange={(value) => {
                    const produto = produtos?.find(p => p.id === value);
                    setItemAtual({
                      ...itemAtual, 
                      produto_id: value,
                      valor_unitario: produto?.preco_unitario || 0
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos?.map((produto) => (
                      <SelectItem key={produto.id} value={produto.id}>
                        {produto.nome || produto.descricao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Quantidade</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={itemAtual.quantidade}
                  onChange={(e) => setItemAtual({...itemAtual, quantidade: parseFloat(e.target.value)})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Valor Unitário</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={itemAtual.valor_unitario}
                  onChange={(e) => setItemAtual({...itemAtual, valor_unitario: parseFloat(e.target.value)})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>CFOP</Label>
                <Input
                  value={itemAtual.cfop}
                  onChange={(e) => setItemAtual({...itemAtual, cfop: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button type="button" onClick={adicionarItem} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </div>
            </div>

            {/* Lista de Itens */}
            {itens.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead>Valor Unit.</TableHead>
                    <TableHead>CFOP</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itens.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.produto_nome}</TableCell>
                      <TableCell>{item.quantidade}</TableCell>
                      <TableCell>R$ {item.valor_unitario.toFixed(2)}</TableCell>
                      <TableCell>{item.cfop}</TableCell>
                      <TableCell>R$ {item.valor_total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removerItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={4} className="font-bold">Total Geral:</TableCell>
                    <TableCell className="font-bold">R$ {valorTotalNota.toFixed(2)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Observações */}
        <Card>
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Observações adicionais para a nota fiscal..."
              value={formData.observacoes}
              onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
            />
          </CardContent>
        </Card>

        {/* Botões */}
        <div className="flex justify-end gap-4">
          <Button 
            type="submit" 
            disabled={createNotaFiscal.isPending || itens.length === 0}
            className="min-w-[150px]"
          >
            {createNotaFiscal.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Emitindo...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Emitir NFe
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
