
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

  console.log('=== NBS Component Debug ===');
  console.log('Códigos NBS carregados:', codigosNbs?.length || 0);
  console.log('Loading state:', loading);
  console.log('Search term atual:', searchTerm);
  console.log('Código selecionado atual:', formData.codigo_tributacao_nacional);
  console.log('Item NBS atual:', formData.item_nbs);

  // Buscar códigos filtrados com base no termo de busca
  const codigosFiltrados = searchTerm.trim() ? buscarCodigoPorDescricao(searchTerm) : [];
  console.log('Códigos filtrados:', codigosFiltrados?.length || 0);

  // Buscar o código selecionado atual
  const selectedCodigo = formData.codigo_tributacao_nacional 
    ? buscarCodigoPorCodigo(formData.codigo_tributacao_nacional)
    : null;
  
  console.log('Código selecionado encontrado:', selectedCodigo);

  const handleCodigoSelect = (codigo: any) => {
    console.log('=== Selecionando código NBS ===');
    console.log('Código selecionado:', codigo);
    
    // Atualizar formData com os dados corretos
    const updatedFormData = {
      ...formData, 
      codigo_tributacao_nacional: codigo.codigo, 
      item_nbs: codigo.descricao
    };
    
    setFormData(updatedFormData);
    setOpenCodigoNbs(false);
    setSearchTerm(""); // Limpar busca após seleção
    
    console.log('Estado após seleção:', {
      codigo: codigo.codigo,
      descricao: codigo.descricao,
      formDataAtualizado: updatedFormData
    });
  };

  const handleSearchChange = (value: string) => {
    console.log('=== Termo de busca alterado ===');
    console.log('Novo valor:', value);
    setSearchTerm(value);
  };

  const handleOpenChange = (open: boolean) => {
    console.log('=== Popover Open Change ===');
    console.log('Novo estado:', open);
    setOpenCodigoNbs(open);
    
    // Limpar busca quando fechar
    if (!open) {
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
              className="w-full justify-between text-left font-normal"
              type="button"
            >
              <span className="truncate">
                {selectedCodigo 
                  ? `${selectedCodigo.codigo} - ${selectedCodigo.descricao}`
                  : formData.codigo_tributacao_nacional 
                    ? `${formData.codigo_tributacao_nacional} - ${formData.item_nbs || 'Descrição não encontrada'}`
                    : "Selecione o código NBS"
                }
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[600px] p-0 z-50 bg-white" align="start" side="bottom">
            <Command shouldFilter={false}>
              <CommandInput 
                placeholder="Buscar código NBS..." 
                className="h-9"
                value={searchTerm}
                onValueChange={handleSearchChange}
              />
              <CommandEmpty>
                {searchTerm ? "Nenhum código encontrado para esta busca." : "Digite para buscar códigos NBS."}
              </CommandEmpty>
              <CommandList className="max-h-[300px] overflow-y-auto">
                <CommandGroup>
                  {searchTerm && codigosFiltrados && codigosFiltrados.length > 0 ? (
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
                          <span className="font-medium text-sm">{codigo.codigo}</span>
                          <span className="text-xs text-muted-foreground break-words leading-relaxed">
                            {codigo.descricao}
                          </span>
                        </div>
                      </CommandItem>
                    ))
                  ) : searchTerm ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Nenhum resultado encontrado para "{searchTerm}"
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      Digite para buscar códigos NBS
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
