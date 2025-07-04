
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useCodigosNbs } from "@/hooks/useCodigosNbs";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServicoTributationFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function ServicoTributationFields({ formData, setFormData }: ServicoTributationFieldsProps) {
  const [openCodigoNbs, setOpenCodigoNbs] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { codigosNbs, loading, buscarCodigoPorDescricao, buscarCodigoPorCodigo } = useCodigosNbs();

  console.log('=== ServicoTributationFields Render ===');
  console.log('FormData códigos NBS:', {
    codigo_tributacao_nacional: formData.codigo_tributacao_nacional,
    item_nbs: formData.item_nbs
  });
  console.log('Estado da busca:', {
    searchTerm,
    openCodigoNbs,
    totalCodigos: codigosNbs.length
  });

  // Buscar códigos com base no termo de busca - só busca se tiver termo
  const codigosFiltrados = searchTerm.trim().length >= 2 ? buscarCodigoPorDescricao(searchTerm) : [];
  
  console.log('=== Filtros e resultados ===');
  console.log('Termo de busca atual:', searchTerm);
  console.log('Comprimento do termo:', searchTerm.trim().length);
  console.log('Códigos filtrados:', codigosFiltrados.length);
  
  // Obter informações do código selecionado
  const codigoSelecionado = formData.codigo_tributacao_nacional 
    ? buscarCodigoPorCodigo(formData.codigo_tributacao_nacional)
    : null;

  console.log('Código selecionado no formData:', codigoSelecionado);

  const handleCodigoSelect = (codigo: any) => {
    console.log('=== Selecionando código NBS ===');
    console.log('Código selecionado:', codigo);
    
    // Atualizar dados do formulário com os novos valores
    const updatedFormData = {
      ...formData,
      codigo_tributacao_nacional: codigo.codigo,
      item_nbs: codigo.descricao
    };
    
    console.log('Dados atualizados para salvar:', {
      codigo_tributacao_nacional: updatedFormData.codigo_tributacao_nacional,
      item_nbs: updatedFormData.item_nbs
    });
    
    setFormData(updatedFormData);
    
    // Fechar popover e limpar busca
    setOpenCodigoNbs(false);
    setSearchTerm("");
    
    console.log('Seleção concluída - popover fechado');
  };

  const handleSearchChange = (value: string) => {
    console.log('=== Alteração no termo de busca ===');
    console.log('Valor anterior:', searchTerm);
    console.log('Novo valor:', value);
    setSearchTerm(value);
  };

  const handleOpenChange = (open: boolean) => {
    console.log('=== Mudança no estado do popover ===');
    console.log('Estado anterior:', openCodigoNbs);
    console.log('Novo estado:', open);
    
    setOpenCodigoNbs(open);
    
    if (!open) {
      console.log('Popover fechado - limpando termo de busca');
      setSearchTerm("");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-4">
          <div className="text-sm text-muted-foreground">Carregando códigos NBS...</div>
        </div>
      </div>
    );
  }

  // Texto para exibir no botão - melhorado
  const getDisplayText = () => {
    if (codigoSelecionado) {
      const descricaoTruncada = codigoSelecionado.descricao.length > 60 
        ? codigoSelecionado.descricao.substring(0, 60) + '...' 
        : codigoSelecionado.descricao;
      return `${codigoSelecionado.codigo} - ${descricaoTruncada}`;
    }
    
    if (formData.codigo_tributacao_nacional && formData.item_nbs) {
      const descricaoTruncada = formData.item_nbs.length > 60 
        ? formData.item_nbs.substring(0, 60) + '...' 
        : formData.item_nbs;
      return `${formData.codigo_tributacao_nacional} - ${descricaoTruncada}`;
    }
    
    if (formData.codigo_tributacao_nacional) {
      return `${formData.codigo_tributacao_nacional} - Descrição não encontrada`;
    }
    
    return "Selecione o código NBS";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informações Tributárias</h3>
      
      <div className="space-y-2">
        <Label htmlFor="codigo_tributacao_nacional">Código de Tributação Nacional (NBS)</Label>
        <Popover open={openCodigoNbs} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              role="combobox" 
              aria-expanded={openCodigoNbs}
              className="w-full justify-between text-left font-normal h-auto min-h-[40px] py-2"
              type="button"
            >
              <span className="truncate text-sm">
                {getDisplayText()}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[700px] p-0 z-50" align="start" side="bottom">
            <Command shouldFilter={false} className="max-h-[400px]">
              <CommandInput 
                placeholder="Digite para buscar (mín. 2 caracteres): medicina, 1.01, consultoria..." 
                className="h-9"
                value={searchTerm}
                onValueChange={handleSearchChange}
              />
              <CommandEmpty>
                {searchTerm.length < 2 
                  ? "Digite pelo menos 2 caracteres para buscar códigos NBS" 
                  : `Nenhum código encontrado para "${searchTerm}".`
                }
              </CommandEmpty>
              <CommandList className="max-h-[300px] overflow-y-auto">
                <CommandGroup>
                  {searchTerm.trim().length >= 2 && codigosFiltrados.length > 0 ? (
                    codigosFiltrados.map((codigo) => (
                      <CommandItem
                        key={codigo.codigo}
                        value={`${codigo.codigo}-${codigo.descricao}`}
                        onSelect={() => handleCodigoSelect(codigo)}
                        className="cursor-pointer flex items-start gap-2 p-3 hover:bg-accent"
                      >
                        <Check
                          className={cn(
                            "mt-1 h-4 w-4 flex-shrink-0",
                            formData.codigo_tributacao_nacional === codigo.codigo ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col w-full min-w-0">
                          <span className="font-medium text-sm text-blue-600">{codigo.codigo}</span>
                          <span className="text-xs text-muted-foreground break-words leading-relaxed">
                            {codigo.descricao}
                          </span>
                        </div>
                      </CommandItem>
                    ))
                  ) : searchTerm.trim().length >= 2 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Nenhum resultado encontrado para "{searchTerm}"
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      <div className="space-y-2">
                        <p className="font-medium">Digite para buscar códigos NBS</p>
                        <p className="text-xs">Exemplos: medicina, 1.01, consultoria, engenharia</p>
                        <p className="text-xs text-gray-400">({codigosNbs.length} códigos disponíveis)</p>
                      </div>
                    </div>
                  )}
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
          placeholder="Descrição do item NBS (preenchido automaticamente)"
          value={formData.item_nbs || ""}
          onChange={(e) => setFormData({...formData, item_nbs: e.target.value})}
          readOnly
          className="bg-gray-50"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isencao_issqn"
          checked={formData.isencao_issqn || false}
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
          value={formData.codigo_servico_municipal || ""}
          onChange={(e) => setFormData({...formData, codigo_servico_municipal: e.target.value})}
        />
      </div>
    </div>
  );
}
