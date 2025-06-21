
import React, { useState } from 'react';
import { ClipboardList, Settings, Tag, FileText, Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNaturezaOperacao, useNaturezaOperacaoStats } from '@/hooks/useNaturezaOperacao';

const NaturezaOperacao = () => {
  const [busca, setBusca] = useState('');
  const { data: naturezas, isLoading } = useNaturezaOperacao();
  const { data: stats, isLoading: loadingStats } = useNaturezaOperacaoStats();

  // Filtrar naturezas baseado na busca
  const naturezasFiltradas = naturezas?.filter(nat => 
    nat.descricao.toLowerCase().includes(busca.toLowerCase()) ||
    nat.codigo.includes(busca)
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Natureza de Operação</h2>
          <p className="text-muted-foreground">
            Configure as naturezas de operação utilizadas nas notas fiscais
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Natureza
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Cadastradas
            </CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingStats ? '...' : stats?.totalCadastradas || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Naturezas ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mais Utilizada
            </CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingStats ? '...' : (stats?.maisUtilizada?.substring(0, 8) || 'Venda')}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.percentualMaisUtilizada || '0%'} das operações
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              CFOP Vinculados
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingStats ? '...' : stats?.cfopsVinculados || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Códigos configurados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Última Modificação
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loadingStats ? '...' : stats?.ultimaModificacao || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Atrás
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Busca */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Natureza de Operação</CardTitle>
          <CardDescription>Encontre rapidamente uma natureza específica</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por descrição ou código..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Naturezas */}
      <Card>
        <CardHeader>
          <CardTitle>Naturezas de Operação Cadastradas</CardTitle>
          <CardDescription>
            Gerencie todas as naturezas de operação do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <ClipboardList className="h-8 w-8 mx-auto mb-4 opacity-50 animate-spin" />
              <p>Carregando naturezas...</p>
            </div>
          ) : naturezasFiltradas.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ClipboardList className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">
                {busca ? 'Nenhuma natureza encontrada' : 'Nenhuma natureza cadastrada'}
              </p>
              <p className="text-sm">
                {busca ? 'Tente ajustar o termo de busca' : 'Comece criando uma nova natureza de operação'}
              </p>
              {!busca && (
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeira Natureza
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {naturezasFiltradas.map((natureza) => (
                <div key={natureza.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Código: {natureza.codigo}</Badge>
                      <Badge variant={natureza.ativo ? 'default' : 'secondary'}>
                        {natureza.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    <h3 className="font-medium">{natureza.descricao}</h3>
                    <div className="text-sm text-muted-foreground mt-1">
                      <p>CFOP Dentro: {natureza.cfop_dentro_estado} | Fora: {natureza.cfop_fora_estado} | Exterior: {natureza.cfop_exterior}</p>
                      <p>Finalidade: {natureza.finalidade}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NaturezaOperacao;
