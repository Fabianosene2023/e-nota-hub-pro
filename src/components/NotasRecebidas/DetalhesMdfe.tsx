
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMdfeDetalhes } from "@/hooks/useMdfeRecebidos";
import { FileText, Package, Truck, MapPin, Calendar, DollarSign, Weight } from "lucide-react";

interface DetalhesMdfeProps {
  mdfeId: string;
}

export const DetalhesMdfe: React.FC<DetalhesMdfeProps> = ({ mdfeId }) => {
  const { data: mdfe, isLoading } = useMdfeDetalhes(mdfeId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!mdfe) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">MDFe não encontrado</p>
        </CardContent>
      </Card>
    );
  }

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <CardTitle>Detalhes do MDFe {mdfe.numero_mdfe}</CardTitle>
            <Badge className={getStatusBadgeColor(mdfe.status)}>
              {mdfe.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informações Gerais */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Número/Série</span>
              </div>
              <p>{mdfe.numero_mdfe} / {mdfe.serie}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Data Emissão</span>
              </div>
              <p>{new Date(mdfe.data_emissao).toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Data Recebimento</span>
              </div>
              <p>{new Date(mdfe.data_recebimento).toLocaleDateString('pt-BR')}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">Valor Total</span>
              </div>
              <p className="font-mono">R$ {mdfe.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Weight className="h-4 w-4" />
                <span className="font-medium">Peso Total</span>
              </div>
              <p className="font-mono">{mdfe.peso_total.toLocaleString('pt-BR', { minimumFractionDigits: 3 })} kg</p>
            </div>
            
            <div className="space-y-2">
              <span className="font-medium">Ambiente</span>
              <div>
                <Badge variant={mdfe.ambiente_emissao === 'producao' ? 'default' : 'secondary'}>
                  {mdfe.ambiente_emissao}
                </Badge>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Informações do Remetente */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Remetente</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Nome:</span>
                <p>{mdfe.remetente_nome}</p>
              </div>
              <div>
                <span className="font-medium">CNPJ:</span>
                <p className="font-mono">{mdfe.remetente_cnpj}</p>
              </div>
            </div>
          </div>
          
          {mdfe.destinatario_nome && (
            <>
              <Separator />
              {/* Informações do Destinatário */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Destinatário</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium">Nome:</span>
                    <p>{mdfe.destinatario_nome}</p>
                  </div>
                  {mdfe.destinatario_cnpj && (
                    <div>
                      <span className="font-medium">CNPJ:</span>
                      <p className="font-mono">{mdfe.destinatario_cnpj}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          
          <Separator />
          
          {/* Chave de Acesso */}
          <div className="space-y-2">
            <span className="font-medium">Chave de Acesso:</span>
            <p className="font-mono text-sm bg-muted p-2 rounded break-all">{mdfe.chave_acesso}</p>
          </div>
          
          {mdfe.protocolo_autorizacao && (
            <div className="space-y-2">
              <span className="font-medium">Protocolo de Autorização:</span>
              <p className="font-mono text-sm">{mdfe.protocolo_autorizacao}</p>
            </div>
          )}
          
          {mdfe.observacoes && (
            <div className="space-y-2">
              <span className="font-medium">Observações:</span>
              <p className="text-sm">{mdfe.observacoes}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Itens do MDFe */}
      {mdfe.itens && mdfe.itens.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <CardTitle>Itens/Cargas</CardTitle>
              <Badge variant="secondary">{mdfe.itens.length} item(ns)</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Peso (kg)</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>CFOP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mdfe.itens.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.codigo_produto || "N/A"}</TableCell>
                    <TableCell>{item.descricao_produto}</TableCell>
                    <TableCell className="font-mono">
                      {item.quantidade.toLocaleString('pt-BR', { minimumFractionDigits: 3 })}
                    </TableCell>
                    <TableCell className="font-mono">
                      {item.peso_item.toLocaleString('pt-BR', { minimumFractionDigits: 3 })}
                    </TableCell>
                    <TableCell className="font-mono">
                      R$ {item.valor_item.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>{item.cfop || "N/A"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
