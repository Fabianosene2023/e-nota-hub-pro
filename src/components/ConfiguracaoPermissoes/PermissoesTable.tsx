
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PERMISSION_MODULES, Permission } from './types';

interface PermissoesTableProps {
  selectedUserId: string | null;
  userPermissions: Record<string, boolean>;
  onPermissionChange: (permissionId: string, granted: boolean) => void;
  isLoading: boolean;
}

const getRoleColor = (module: string) => {
  const colors = {
    dashboard: 'bg-blue-100 text-blue-800',
    empresas: 'bg-green-100 text-green-800',
    nfe: 'bg-purple-100 text-purple-800',
    nfce: 'bg-pink-100 text-pink-800',
    clientes: 'bg-yellow-100 text-yellow-800',
    produtos: 'bg-orange-100 text-orange-800',
    configuracoes: 'bg-red-100 text-red-800',
  };
  return colors[module as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

export const PermissoesTable: React.FC<PermissoesTableProps> = ({
  selectedUserId,
  userPermissions,
  onPermissionChange,
  isLoading,
}) => {
  if (!selectedUserId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permissões do Usuário</CardTitle>
          <CardDescription>
            Selecione um usuário para gerenciar suas permissões
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Nenhum usuário selecionado
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permissões do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Permissões do Usuário</CardTitle>
        <CardDescription>
          Configure as permissões específicas para este usuário
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {PERMISSION_MODULES.map((module) => (
            <div key={module.name} className="space-y-4">
              <h3 className="text-lg font-semibold">{module.name}</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Permissão</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Módulo</TableHead>
                    <TableHead className="w-[100px]">Ativo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {module.permissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="font-medium">
                        {permission.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {permission.description}
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(permission.module)}>
                          {permission.module}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={userPermissions[permission.id] || false}
                          onCheckedChange={(checked) => 
                            onPermissionChange(permission.id, checked)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
