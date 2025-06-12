
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Building, 
  FileText, 
  Settings,
  Edit,
  Trash2
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Empresas() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const empresas = [
    {
      id: 1,
      razaoSocial: "Tech Solutions Inovações Ltda",
      nomeFantasia: "Tech Solutions",
      cnpj: "12.345.678/0001-90",
      ie: "123.456.789.123",
      regime: "Lucro Presumido",
      status: "ativa",
      certificado: "Válido até 12/2025",
    },
    {
      id: 2,
      razaoSocial: "Consultoria Empresarial Digital SA",
      nomeFantasia: "ConsultaDigital",
      cnpj: "98.765.432/0001-10",
      ie: "987.654.321.098",
      regime: "Simples Nacional",
      status: "ativa",
      certificado: "Válido até 03/2025",
    },
    {
      id: 3,
      razaoSocial: "Inovação e Desenvolvimento Ltda",
      nomeFantasia: "InovaDev",
      cnpj: "11.222.333/0001-44",
      ie: "111.222.333.444",
      regime: "Lucro Real",
      status: "inativa",
      certificado: "Expirado",
    },
  ];

  const filteredEmpresas = empresas.filter(empresa =>
    empresa.razaoSocial.toLowerCase().includes(searchTerm.toLowerCase()) ||
    empresa.cnpj.includes(searchTerm) ||
    empresa.nomeFantasia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    return status === "ativa" 
      ? <Badge className="fiscal-success">Ativa</Badge>
      : <Badge className="fiscal-neutral">Inativa</Badge>;
  };

  const getCertificadoBadge = (certificado: string) => {
    if (certificado.includes("Expirado")) {
      return <Badge className="fiscal-error">Expirado</Badge>;
    }
    if (certificado.includes("2025")) {
      const month = certificado.split(" ")[2].split("/")[0];
      const isExpiringSoon = parseInt(month) <= 3;
      return isExpiringSoon 
        ? <Badge className="fiscal-warning">Expirando</Badge>
        : <Badge className="fiscal-success">Válido</Badge>;
    }
    return <Badge className="fiscal-success">Válido</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
          <p className="text-muted-foreground">
            Gerencie as empresas emitentes cadastradas
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Empresa</DialogTitle>
              <DialogDescription>
                Preencha os dados da empresa emitente
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="razaoSocial">Razão Social</Label>
                  <Input id="razaoSocial" placeholder="Digite a razão social" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
                  <Input id="nomeFantasia" placeholder="Digite o nome fantasia" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" placeholder="00.000.000/0000-00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ie">Inscrição Estadual</Label>
                  <Input id="ie" placeholder="000.000.000.000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="regime">Regime Tributário</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o regime tributário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simples">Simples Nacional</SelectItem>
                    <SelectItem value="presumido">Lucro Presumido</SelectItem>
                    <SelectItem value="real">Lucro Real</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Cadastrar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por razão social, CNPJ ou nome fantasia..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Companies List */}
      <div className="grid gap-4">
        {filteredEmpresas.map((empresa) => (
          <Card key={empresa.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{empresa.razaoSocial}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span>{empresa.nomeFantasia}</span>
                      <span>•</span>
                      <span>{empresa.cnpj}</span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(empresa.status)}
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Inscrição Estadual</p>
                  <p className="font-medium">{empresa.ie}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Regime Tributário</p>
                  <p className="font-medium">{empresa.regime}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Certificado Digital</p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{empresa.certificado}</span>
                    {getCertificadoBadge(empresa.certificado)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Ver Notas
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEmpresas.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma empresa encontrada</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Tente ajustar sua busca" : "Cadastre a primeira empresa para começar"}
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Empresa
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
