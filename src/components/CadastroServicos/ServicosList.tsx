
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Settings, Trash2, Plus } from "lucide-react";
import { useEmpresasManager } from "@/hooks/useEmpresasManager";

interface ServicosListProps {
  servicos: any[];
  onEdit: (servico: any) => void;
  onDelete: (servicoId: string) => void;
  onNewService: () => void;
}

export function ServicosList({ servicos, onEdit, onDelete, onNewService }: ServicosListProps) {
  const { data: empresas = [] } = useEmpresasManager();

  const getEmpresaNome = (empresaId: string) => {
    const empresa = empresas.find(e => e.id === empresaId);
    return empresa?.razao_social || "Empresa não encontrada";
  };

  if (servicos.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum serviço encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Cadastre o primeiro serviço para começar
          </p>
          <Button onClick={onNewService}>
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Serviço
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {servicos.map((servico) => (
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
                <Button variant="ghost" size="sm" onClick={() => onEdit(servico)}>
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
                onClick={() => onDelete(servico.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
