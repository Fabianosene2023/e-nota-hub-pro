
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Plus, 
  Search, 
  Settings,
  Edit,
  Trash2
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useServicosManager, useCreateServicoManager, useUpdateServicoManager, useDeleteServicoManager } from "@/hooks/useServicosManager";
import { useEmpresasManager } from "@/hooks/useEmpresasManager";
import { useCodigosNbs } from "@/hooks/useCodigosNbs";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { toast } from "@/hooks/use-toast";

export function CadastroServicos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingServico, setEditingServico] = useState<any>(null);
  const [deletingServicoId, setDeletingServicoId] = useState<string | null>(null);
  const [openCodigoNbs, setOpenCodigoNbs] = useState(false);
  const [formData, setFormData] = useState({
    empresa_id: "",
    codigo: "",
    nome: "",
    descricao: "",
    preco_unitario: "",
    unidade: "UN",
    aliquota_iss: "",
    codigo_servico_municipal: "",
    local_prestacao: "",
    municipio_prestacao: "",
    codigo_tributacao_nacional: "",
    isencao_issqn: false,
    descricao_servico: "",
    item_nbs: "",
    numero_documento_responsabilidade_tecnica: "",
    documento_referencia: "",
    informacoes_complementares: "",
    valor_servico_prestado: "",
    opcao_tributos: "3",
    valor_tributos_federais: "",
    valor_tributos_estaduais: "",
    valor_tributos_municipais: "",
    percentual_tributos_federais: "",
    percentual_tributos_estaduais: "",
    percentual_tributos_municipais: ""
  });

  const { data: servicos = [], isLoading } = useServicosManager();
  const { data: empresas = [] } = useEmpresasManager();
  const { codigosNbs, buscarCodigoPorDescricao } = useCodigosNbs();
  const createServico = useCreateServicoManager();
  const updateServico = useUpdateServicoManager();
  const deleteServico = useDeleteServicoManager();

  const filteredServicos = servicos.filter(servico =>
    servico.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servico.codigo?.includes(searchTerm) ||
    servico.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      empresa_id: "",
      codigo: "",
      nome: "",
      descricao: "",
      preco_unitario: "",
      unidade: "UN",
      aliquota_iss: "",
      codigo_servico_municipal: "",
      local_prestacao: "",
      municipio_prestacao: "",
      codigo_tributacao_nacional: "",
      isencao_issqn: false,
      descricao_servico: "",
      item_nbs: "",
      numero_documento_responsabilidade_tecnica: "",
      documento_referencia: "",
      informacoes_complementares: "",
      valor_servico_prestado: "",
      opcao_tributos: "3",
      valor_tributos_federais: "",
      valor_tributos_estaduais: "",
      valor_tributos_municipais: "",
      percentual_tributos_federais: "",
      percentual_tributos_estaduais: "",
      percentual_tributos_municipais: ""
    });
  };

  const handleCreate = () => {
    if (!formData.empresa_id || !formData.codigo || !formData.nome || !formData.preco_unitario) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const servicoData = {
      ...formData,
      preco_unitario: parseFloat(formData.preco_unitario),
      aliquota_iss: formData.aliquota_iss ? parseFloat(formData.aliquota_iss) : 0,
      valor_servico_prestado: formData.valor_servico_prestado ? parseFloat(formData.valor_servico_prestado) : 0,
      opcao_tributos: parseInt(formData.opcao_tributos),
      valor_tributos_federais: formData.valor_tributos_federais ? parseFloat(formData.valor_tributos_federais) : 0,
      valor_tributos_estaduais: formData.valor_tributos_estaduais ? parseFloat(formData.valor_tributos_estaduais) : 0,
      valor_tributos_municipais: formData.valor_tributos_municipais ? parseFloat(formData.valor_tributos_municipais) : 0,
      percentual_tributos_federais: formData.percentual_tributos_federais ? parseFloat(formData.percentual_tributos_federais) : 0,
      percentual_tributos_estaduais: formData.percentual_tributos_estaduais ? parseFloat(formData.percentual_tributos_estaduais) : 0,
      percentual_tributos_municipais: formData.percentual_tributos_municipais ? parseFloat(formData.percentual_tributos_municipais) : 0,
      ativo: true
    };

    createServico.mutate(servicoData, {
      onSuccess: () => {
        setIsDialogOpen(false);
        resetForm();
      }
    });
  };

  const handleEdit = (servico: any) => {
    setEditingServico(servico);
    setFormData({
      empresa_id: servico.empresa_id || "",
      codigo: servico.codigo || "",
      nome: servico.nome || "",
      descricao: servico.descricao || "",
      preco_unitario: servico.preco_unitario?.toString() || "",
      unidade: servico.unidade || "UN",
      aliquota_iss: servico.aliquota_iss?.toString() || "",
      codigo_servico_municipal: servico.codigo_servico_municipal || "",
      local_prestacao: servico.local_prestacao || "",
      municipio_prestacao: servico.municipio_prestacao || "",
      codigo_tributacao_nacional: servico.codigo_tributacao_nacional || "",
      isencao_issqn: servico.isencao_issqn || false,
      descricao_servico: servico.descricao_servico || "",
      item_nbs: servico.item_nbs || "",
      numero_documento_responsabilidade_tecnica: servico.numero_documento_responsabilidade_tecnica || "",
      documento_referencia: servico.documento_referencia || "",
      informacoes_complementares: servico.informacoes_complementares || "",
      valor_servico_prestado: servico.valor_servico_prestado?.toString() || "",
      opcao_tributos: servico.opcao_tributos?.toString() || "3",
      valor_tributos_federais: servico.valor_tributos_federais?.toString() || "",
      valor_tributos_estaduais: servico.valor_tributos_estaduais?.toString() || "",
      valor_tributos_municipais: servico.valor_tributos_municipais?.toString() || "",
      percentual_tributos_federais: servico.percentual_tributos_federais?.toString() || "",
      percentual_tributos_estaduais: servico.percentual_tributos_estaduais?.toString() || "",
      percentual_tributos_municipais: servico.percentual_tributos_municipais?.toString() || ""
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!formData.empresa_id || !formData.codigo || !formData.nome || !formData.preco_unitario) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    const servicoData = {
      ...formData,
      preco_unitario: parseFloat(formData.preco_unitario),
      aliquota_iss: formData.aliquota_iss ? parseFloat(formData.aliquota_iss) : 0,
      valor_servico_prestado: formData.valor_servico_prestado ? parseFloat(formData.valor_servico_prestado) : 0,
      opcao_tributos: parseInt(formData.opcao_tributos),
      valor_tributos_federais: formData.valor_tributos_federais ? parseFloat(formData.valor_tributos_federais) : 0,
      valor_tributos_estaduais: formData.valor_tributos_estaduais ? parseFloat(formData.valor_tributos_estaduais) : 0,
      valor_tributos_municipais: formData.valor_tributos_municipais ? parseFloat(formData.valor_tributos_municipais) : 0,
      percentual_tributos_federais: formData.percentual_tributos_federais ? parseFloat(formData.percentual_tributos_federais) : 0,
      percentual_tributos_estaduais: formData.percentual_tributos_estaduais ? parseFloat(formData.percentual_tributos_estaduais) : 0,
      percentual_tributos_municipais: formData.percentual_tributos_municipais ? parseFloat(formData.percentual_tributos_municipais) : 0
    };

    updateServico.mutate({
      id: editingServico.id,
      updates: servicoData
    }, {
      onSuccess: () => {
        setIsEditDialogOpen(false);
        setEditingServico(null);
        resetForm();
      }
    });
  };

  const handleDeleteClick = (servicoId: string) => {
    setDeletingServicoId(servicoId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingServicoId) {
      deleteServico.mutate(deletingServicoId, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          setDeletingServicoId(null);
        }
      });
    }
  };

  const getEmpresaNome = (empresaId: string) => {
    const empresa = empresas.find(e => e.id === empresaId);
    return empresa?.razao_social || "Empresa não encontrada";
  };

  if (isLoading) {
    return <div>Carregando serviços...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cadastro de Serviços</h1>
          <p className="text-muted-foreground">
            Gerencie os serviços cadastrados
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Serviço</DialogTitle>
              <DialogDescription>
                Preencha os dados do serviço
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              {/* Dados Básicos */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dados Básicos</h3>
                <div className="space-y-2">
                  <Label htmlFor="empresa">Empresa *</Label>
                  <Select value={formData.empresa_id} onValueChange={(value) => setFormData({...formData, empresa_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {empresas.map((empresa) => (
                        <SelectItem key={empresa.id} value={empresa.id}>
                          {empresa.razao_social}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="codigo">Código *</Label>
                    <Input 
                      id="codigo" 
                      placeholder="Digite o código"
                      value={formData.codigo}
                      onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome *</Label>
                    <Input 
                      id="nome" 
                      placeholder="Digite o nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea 
                    id="descricao" 
                    placeholder="Digite a descrição"
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  />
                </div>
              </div>

              {/* Valores do Serviço */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Valores do Serviço</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preco">Preço Unitário *</Label>
                    <Input 
                      id="preco" 
                      placeholder="0,00"
                      type="number"
                      step="0.01"
                      value={formData.preco_unitario}
                      onChange={(e) => setFormData({...formData, preco_unitario: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valor_servico_prestado">Valor do Serviço Prestado</Label>
                    <Input 
                      id="valor_servico_prestado" 
                      placeholder="0,00"
                      type="number"
                      step="0.01"
                      value={formData.valor_servico_prestado}
                      onChange={(e) => setFormData({...formData, valor_servico_prestado: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unidade">Unidade</Label>
                    <Select value={formData.unidade} onValueChange={(value) => setFormData({...formData, unidade: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UN">Unidade</SelectItem>
                        <SelectItem value="HR">Hora</SelectItem>
                        <SelectItem value="DIA">Dia</SelectItem>
                        <SelectItem value="MES">Mês</SelectItem>
                        <SelectItem value="ANO">Ano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aliquota">Alíquota ISS (%)</Label>
                  <Input 
                    id="aliquota" 
                    placeholder="0,00"
                    type="number"
                    step="0.01"
                    value={formData.aliquota_iss}
                    onChange={(e) => setFormData({...formData, aliquota_iss: e.target.value})}
                  />
                </div>
              </div>

              {/* Valores Aproximados dos Tributos */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Valor Aproximado dos Tributos</h3>
                <div className="space-y-4">
                  <RadioGroup
                    value={formData.opcao_tributos}
                    onValueChange={(value) => setFormData({...formData, opcao_tributos: value})}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1" id="opcao1" />
                      <Label htmlFor="opcao1">Preencher os valores monetários em cada NFS-e emitida</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="opcao2" />
                      <Label htmlFor="opcao2">Configurar os valores percentuais correspondentes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="opcao3" />
                      <Label htmlFor="opcao3">Não informar nenhum valor estimado para os Tributos (Decreto 8.264/2014)</Label>
                    </div>
                  </RadioGroup>

                  {formData.opcao_tributos === "1" && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="valor_tributos_federais">Valor Tributos Federais (R$)</Label>
                        <Input 
                          id="valor_tributos_federais" 
                          placeholder="0,00"
                          type="number"
                          step="0.01"
                          value={formData.valor_tributos_federais}
                          onChange={(e) => setFormData({...formData, valor_tributos_federais: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="valor_tributos_estaduais">Valor Tributos Estaduais (R$)</Label>
                        <Input 
                          id="valor_tributos_estaduais" 
                          placeholder="0,00"
                          type="number"
                          step="0.01"
                          value={formData.valor_tributos_estaduais}
                          onChange={(e) => setFormData({...formData, valor_tributos_estaduais: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="valor_tributos_municipais">Valor Tributos Municipais (R$)</Label>
                        <Input 
                          id="valor_tributos_municipais" 
                          placeholder="0,00"
                          type="number"
                          step="0.01"
                          value={formData.valor_tributos_municipais}
                          onChange={(e) => setFormData({...formData, valor_tributos_municipais: e.target.value})}
                        />
                      </div>
                    </div>
                  )}

                  {formData.opcao_tributos === "2" && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="percentual_tributos_federais">Federal (%)</Label>
                        <Input 
                          id="percentual_tributos_federais" 
                          placeholder="0,00"
                          type="number"
                          step="0.01"
                          value={formData.percentual_tributos_federais}
                          onChange={(e) => setFormData({...formData, percentual_tributos_federais: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="percentual_tributos_estaduais">Estadual (%)</Label>
                        <Input 
                          id="percentual_tributos_estaduais" 
                          placeholder="0,00"
                          type="number"
                          step="0.01"
                          value={formData.percentual_tributos_estaduais}
                          onChange={(e) => setFormData({...formData, percentual_tributos_estaduais: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="percentual_tributos_municipais">Municipal (%)</Label>
                        <Input 
                          id="percentual_tributos_municipais" 
                          placeholder="0,00"
                          type="number"
                          step="0.01"
                          value={formData.percentual_tributos_municipais}
                          onChange={(e) => setFormData({...formData, percentual_tributos_municipais: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Localização */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Localização do Serviço</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="local_prestacao">Local da Prestação</Label>
                    <Input 
                      id="local_prestacao" 
                      placeholder="Local onde será prestado"
                      value={formData.local_prestacao}
                      onChange={(e) => setFormData({...formData, local_prestacao: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="municipio_prestacao">Município</Label>
                    <Input 
                      id="municipio_prestacao" 
                      placeholder="Município da prestação"
                      value={formData.municipio_prestacao}
                      onChange={(e) => setFormData({...formData, municipio_prestacao: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Tributação */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informações Tributárias</h3>
                <div className="space-y-2">
                  <Label htmlFor="codigo_tributacao_nacional">Código de Tributação Nacional (NBS)</Label>
                  <Popover open={openCodigoNbs} onOpenChange={setOpenCodigoNbs}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        {formData.codigo_tributacao_nacional || "Selecione o código NBS"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[500px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Buscar código NBS..." />
                        <CommandList className="max-h-[300px] overflow-y-auto">
                          <CommandEmpty>Nenhum código encontrado.</CommandEmpty>
                          <CommandGroup>
                            {codigosNbs.map((codigo) => (
                              <CommandItem
                                key={codigo.codigo}
                                value={`${codigo.codigo} - ${codigo.descricao}`}
                                onSelect={() => {
                                  setFormData({...formData, codigo_tributacao_nacional: codigo.codigo, item_nbs: codigo.descricao});
                                  setOpenCodigoNbs(false);
                                }}
                                className="cursor-pointer"
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium">{codigo.codigo}</span>
                                  <span className="text-sm text-muted-foreground">{codigo.descricao}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="item_nbs">Item da NBS</Label>
                  <Input 
                    id="item_nbs" 
                    placeholder="Descrição do item NBS"
                    value={formData.item_nbs}
                    onChange={(e) => setFormData({...formData, item_nbs: e.target.value})}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isencao_issqn"
                    checked={formData.isencao_issqn}
                    onCheckedChange={(checked) => setFormData({...formData, isencao_issqn: checked})}
                  />
                  <Label htmlFor="isencao_issqn">
                    O serviço é caso de imunidade, exportação ou não incidência do ISSQN?
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigoMunicipal">Código Serviço Municipal</Label>
                  <Input 
                    id="codigoMunicipal" 
                    placeholder="Digite o código municipal"
                    value={formData.codigo_servico_municipal}
                    onChange={(e) => setFormData({...formData, codigo_servico_municipal: e.target.value})}
                  />
                </div>
              </div>

              {/* Detalhes do Serviço */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Detalhes do Serviço</h3>
                <div className="space-y-2">
                  <Label htmlFor="descricao_servico">Descrição do Serviço</Label>
                  <Textarea 
                    id="descricao_servico" 
                    placeholder="Descrição detalhada do serviço prestado"
                    value={formData.descricao_servico}
                    onChange={(e) => setFormData({...formData, descricao_servico: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numero_documento_responsabilidade_tecnica">Número do Documento de Responsabilidade Técnica</Label>
                  <Input 
                    id="numero_documento_responsabilidade_tecnica" 
                    placeholder="Número do documento"
                    value={formData.numero_documento_responsabilidade_tecnica}
                    onChange={(e) => setFormData({...formData, numero_documento_responsabilidade_tecnica: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documento_referencia">Documento de Referência</Label>
                  <Input 
                    id="documento_referencia" 
                    placeholder="Documento de referência"
                    value={formData.documento_referencia}
                    onChange={(e) => setFormData({...formData, documento_referencia: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="informacoes_complementares">Informações Complementares</Label>
                  <Textarea 
                    id="informacoes_complementares" 
                    placeholder="Informações adicionais sobre o serviço"
                    value={formData.informacoes_complementares}
                    onChange={(e) => setFormData({...formData, informacoes_complementares: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={createServico.isPending}
              >
                {createServico.isPending ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Serviço</DialogTitle>
            <DialogDescription>
              Atualize os dados do serviço
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editEmpresa">Empresa *</Label>
              <Select value={formData.empresa_id} onValueChange={(value) => setFormData({...formData, empresa_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a empresa" />
                </SelectTrigger>
                <SelectContent>
                  {empresas.map((empresa) => (
                    <SelectItem key={empresa.id} value={empresa.id}>
                      {empresa.razao_social}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editCodigo">Código *</Label>
                <Input 
                  id="editCodigo" 
                  placeholder="Digite o código"
                  value={formData.codigo}
                  onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editNome">Nome *</Label>
                <Input 
                  id="editNome" 
                  placeholder="Digite o nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdate}
              disabled={updateServico.isPending}
            >
              {updateServico.isPending ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Excluir Serviço"
        description="Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
      />

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, código ou descrição..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Services List */}
      <div className="grid gap-4">
        {filteredServicos.map((servico) => (
          <Card key={servico.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{servico.nome}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-1">
                    <span>Código: {servico.codigo}</span>
                    <span>•</span>
                    <span>Empresa: {getEmpresaNome(servico.empresa_id)}</span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="fiscal-success">Ativo</Badge>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(servico)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Preço Unitário</p>
                  <p className="font-medium">R$ {Number(servico.preco_unitario).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unidade</p>
                  <p className="font-medium">{servico.unidade}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alíquota ISS</p>
                  <p className="font-medium">{Number(servico.aliquota_iss || 0).toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cód. Municipal</p>
                  <p className="font-medium">{servico.codigo_servico_municipal || 'Não informado'}</p>
                </div>
              </div>
              {servico.descricao && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Descrição</p>
                  <p className="font-medium">{servico.descricao}</p>
                </div>
              )}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDeleteClick(servico.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredServicos.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum serviço encontrado</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Tente ajustar sua busca" : "Cadastre o primeiro serviço para começar"}
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Serviço
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
