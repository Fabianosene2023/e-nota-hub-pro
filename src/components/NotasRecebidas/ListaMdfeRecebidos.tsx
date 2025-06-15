
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, FileText, Package } from "lucide-react";

interface MdfeRecebido {
  id: string;
  numero_mdfe: string;
  serie: string;
  chave_acesso: string;
  data_emissao: string;
  data_recebimento: string;
  remetente_cnpj: string;
  remetente_nome: string;
  destinatario_nome: string;
  valor_total: number;
  peso_total: number;
  status: string;
  ambiente_emissao: string;
}

interface ListaMdfeRecebidosProps {
  mdfeList: MdfeRecebido[];
  onSelecionarMdfe: (mdfeId: string) => void;
  mdfeSelcionado: string | null;
}

export const ListaMdfeRecebidos: React.FC<ListaMdfeRecebidosProps> = ({
  mdfeList,
  onSelecionarMdfe,
  mdfeSelcionado
}) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'recebido':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'processado':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'erro':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getAmbienteBadgeColor = (ambiente: string) => {
    return ambiente === 'producao' 
      ? 'text-green-700 bg-green-50 border-green-200'
      : 'text-orange-700 bg-orange-50 border-orange-200';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          <CardTitle>MDFe Recebidos</CardTitle>
          <Badge variant="secondary">{mdfeList.length} documento(s)</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MDFe</TableHead>
                <TableHead>Remetente</TableHead>
                <TableHead>Destinatário</TableHead>
                <TableHead>Emissão</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Peso (kg)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ambiente</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mdfeList.map((mdfe) => (
                <TableRow 
                  key={mdfe.id}
                  className={mdfeSelcionado === mdfe.id ? "bg-muted/50" : ""}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{mdfe.numero_mdfe}</span>
                      <span className="text-xs text-muted-foreground">Série {mdfe.serie}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{mdfe.remetente_nome}</span>
                      <span className="text-xs text-muted-foreground">{mdfe.remetente_cnpj}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{mdfe.destinatario_nome || "Não informado"}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(mdfe.data_emissao).toLocaleDateString('pt-BR')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">
                      R$ {mdfe.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">
                      {mdfe.peso_total.toLocaleString('pt-BR', { minimumFractionDigits: 3 })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(mdfe.status)}>
                      {mdfe.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getAmbienteBadgeColor(mdfe.ambiente_emissao)}>
                      {mdfe.ambiente_emissao}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelecionarMdfe(mdfe.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
