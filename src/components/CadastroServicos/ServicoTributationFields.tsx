
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useCodigosNbs } from "@/hooks/useCodigosNbs";

interface ServicoTributationFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function ServicoTributationFields({ formData, setFormData }: ServicoTributationFieldsProps) {
  const [openCodigoNbs, setOpenCodigoNbs] = useState(false);
  const { codigosNbs } = useCodigosNbs();

  return (
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
  );
}
