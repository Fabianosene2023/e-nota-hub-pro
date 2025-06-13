
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Building, Users, Package, BarChart3, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900">FiscalPro</span>
          </div>
          <Link to="/login">
            <Button>Entrar no Sistema</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Sistema Completo de <br />
          <span className="text-primary">Gestão Fiscal</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Gerencie notas fiscais, cadastros, relatórios e configurações fiscais em uma única plataforma moderna e intuitiva.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/login">
            <Button size="lg" className="px-8">
              Acessar Sistema
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Funcionalidades Principais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <FileText className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Emissão de NFe</CardTitle>
              <CardDescription>
                Emita notas fiscais eletrônicas com certificado digital, integração SEFAZ e geração automática de DANFE
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Building className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Gestão de Empresas</CardTitle>
              <CardDescription>
                Gerencie múltiplas empresas com configurações fiscais independentes e certificados digitais
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Cadastro de Clientes</CardTitle>
              <CardDescription>
                Sistema completo de cadastro com validações fiscais para CPF, CNPJ e Inscrição Estadual
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Package className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Gestão de Produtos</CardTitle>
              <CardDescription>
                Cadastre produtos com NCM, CFOP, alíquotas de impostos e controle de estoque
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Relatórios Avançados</CardTitle>
              <CardDescription>
                Relatórios detalhados com gráficos interativos e exportação para CSV
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-4" />
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Sistema seguro com autenticação, controle de acesso e criptografia de dados
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Acesse o sistema e comece a gerenciar suas operações fiscais de forma mais eficiente.
          </p>
          <Link to="/login">
            <Button size="lg" variant="secondary" className="px-8">
              Entrar no Sistema
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="h-6 w-6" />
            <span className="text-xl font-bold">FiscalPro</span>
          </div>
          <p className="text-gray-400">
            Sistema de Gestão Fiscal - Desenvolvido com React e Supabase
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
