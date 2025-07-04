
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { usePrestadoresServico } from '@/hooks/usePrestadoresServico';
import { useAuth } from '@/contexts/AuthContext';

export const PrestadoresTable = () => {
  const { profile } = useAuth();
  const { data: prestadores, isLoading, error } = usePrestadoresServico(profile?.empresa_id);

  console.log('PrestadoresTable - Profile empresa_id:', profile?.empresa_id);
  console.log('PrestadoresTable - Prestadores data:', prestadores);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Carregando prestadores...</div>
      </div>
    );
  }

  if (error) {
    console.error('Error in PrestadoresTable:', error);
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-red-600">Erro ao carregar prestadores de serviço</div>
      </div>
    );
  }

  if (!prestadores?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum prestador de serviço cadastrado
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Inscrição Municipal</TableHead>
            <TableHead>Regime Tributário</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prestadores.map((prestador) => {
            console.log('Rendering prestador:', prestador.id, 'empresa data:', prestador.empresa);
            return (
              <TableRow key={prestador.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {prestador.empresa?.razao_social || 'Empresa não encontrada'}
                    </span>
                    {prestador.empresa?.nome_fantasia && (
                      <span className="text-sm text-muted-foreground">
                        {prestador.empresa.nome_fantasia}
                      </span>
                    )}
                    {prestador.empresa && (
                      <span className="text-xs text-muted-foreground">
                        {prestador.empresa.cidade} - {prestador.empresa.estado}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono">{prestador.cnpj}</TableCell>
                <TableCell>{prestador.inscricao_municipal || '-'}</TableCell>
                <TableCell className="capitalize">
                  {prestador.regime_tributario.replace('_', ' ')}
                </TableCell>
                <TableCell>
                  <Badge variant={prestador.ativo ? "default" : "secondary"}>
                    {prestador.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
