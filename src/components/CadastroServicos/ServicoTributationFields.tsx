
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
  const { codigosNbs, loading } = useCodigosNbs();

  console.log('Códigos NBS carregados:', codigosNbs?.length || 0);
  console.log('Loading state:', loading);
  console.log('Código selecionado atual:', formData.codigo_tributacao_nacional);

  const selectedCodigo = codigosNbs?.find((codigo) => codigo.codigo === formData.codigo_tributacao_nacional);

  const handleCodigoSelect = (codigo: any) => {
    console.log('Selecionando código NBS:', codigo);
    
    setFormData({
      ...formData, 
      codigo_tributacao_nacional: codigo.codigo, 
      item_nbs: codigo.descricao
    });
    
    setOpenCodigoNbs(false);
    console.log('Estado após seleção - Código:', codigo.codigo, 'Descrição:', codigo.descricao);
  };

  if (loading) {
    return <div>Carregando códigos NBS...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informações Tributárias</h3>
      
      <div className="space-y-2">
        <Label htmlFor="codigo_tributacao_nacional">Código de Tributação Nacional (NBS)</Label>
        <Popover open={openCodigoNbs} onOpenChange={setOpenCodigoNbs}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              role="combobox" 
              aria-expanded={openCodigoNbs}
              className="w-full justify-between text-left"
              type="button"
            >
              {selectedCodigo 
                ? `${selectedCodigo.codigo} - ${selectedCodigo.descricao}`
                : "Selecione o código NBS"
              }
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[600px] p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput 
                placeholder="Buscar código NBS..." 
                className="h-9"
              />
              <CommandEmpty>Nenhum código encontrado.</CommandEmpty>
              <CommandList className="max-h-[200px] overflow-y-auto">
                <CommandGroup>
                  {codigosNbs && codigosNbs.map((codigo) => (
                    <CommandItem
                      key={codigo.codigo}
                      value={`${codigo.codigo} ${codigo.descricao}`}
                      onSelect={() => handleCodigoSelect(codigo)}
                      className="cursor-pointer flex items-start gap-2 p-2"
                    >
                      <Check
                        className={cn(
                          "mt-1 h-4 w-4 flex-shrink-0",
                          formData.codigo_tributacao_nacional === codigo.codigo ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col w-full min-w-0">
                        <span className="font-medium text-sm">{codigo.codigo}</span>
                        <span className="text-xs text-muted-foreground break-words">{codigo.descricao}</span>
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
