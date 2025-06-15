
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
}

interface UsuarioSelectorProps {
  usuarios: Usuario[] | undefined;
  usuarioSelecionado: string;
  onUsuarioChange: (usuarioId: string) => void;
  isLoading: boolean;
}

const getRoleLabel = (role: string) => {
  const roles = {
    admin: 'Administrador',
    editor: 'Editor',
    visualizador: 'Visualizador'
  };
  return roles[role as keyof typeof roles] || role;
};

const getRoleVariant = (role: string) => {
  const variants = {
    admin: 'destructive',
    editor: 'default',
    visualizador: 'secondary'
  };
  return variants[role as keyof typeof variants] || 'default';
};

export const UsuarioSelector: React.FC<UsuarioSelectorProps> = ({
  usuarios,
  usuarioSelecionado,
  onUsuarioChange,
  isLoading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecionar Usuário</CardTitle>
        <CardDescription>
          Escolha o usuário para configurar suas permissões específicas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-16">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Select value={usuarioSelecionado} onValueChange={onUsuarioChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um usuário" />
            </SelectTrigger>
            <SelectContent>
              {usuarios?.map((usuario) => (
                <SelectItem key={usuario.id} value={usuario.id}>
                  <div className="flex items-center gap-2">
                    <span>{usuario.nome}</span>
                    <span className="text-muted-foreground">({usuario.email})</span>
                    <Badge variant={getRoleVariant(usuario.role) as any}>
                      {getRoleLabel(usuario.role)}
                    </Badge>
                    {!usuario.ativo && (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardContent>
    </Card>
  );
};
