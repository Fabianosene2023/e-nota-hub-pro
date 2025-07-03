
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ServicoLocationFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function ServicoLocationFields({ formData, setFormData }: ServicoLocationFieldsProps) {
  return (
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
  );
}
