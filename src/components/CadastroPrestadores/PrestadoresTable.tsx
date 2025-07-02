
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { usePrestadoresServico } from '@/hooks/usePrestadoresServico';
import { useAuth } from '@/contexts/AuthContext';

export const PrestadoresTable = () => {
  const { profile } = useAuth();
  const { data: prestadores, isLoading } = usePrestadoresServico(profile?.empresa_id);

  if (isLoading) {
    return <div>Carregando prestadores...</div>;
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
          {prestadores.map((prestador) => (
            <TableRow key={prestador.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{prestador.empresas?.razao_social || 'N/A'}</span>
                  {prestador.empresas?.nome_fantasia && (
                    <span className="text-sm text-muted-foreground">{prestador.empresas.nome_fantasia}</span>
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
