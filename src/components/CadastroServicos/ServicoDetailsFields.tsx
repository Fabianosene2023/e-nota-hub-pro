
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ServicoDetailsFieldsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function ServicoDetailsFields({ formData, setFormData }: ServicoDetailsFieldsProps) {
  return (
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
  );
}
