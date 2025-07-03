
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmpresasManager } from "@/hooks/useEmpresasManager";

interface ServicoBasicFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function ServicoBasicFields({ formData, setFormData }: ServicoBasicFieldsProps) {
  const { data: empresas = [] } = useEmpresasManager();

  return (
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
  );
}
