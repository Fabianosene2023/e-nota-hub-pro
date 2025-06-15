
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
  empresa_id?: string;
  user_id?: string; // Para user_profiles
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
    visualizador: 'Visualizador',
    user: 'Usuário'
  };
  return roles[role as keyof typeof roles] || role;
};

const getRoleVariant = (role: string): "default" | "destructive" | "secondary" | "outline" => {
  const variants = {
    admin: 'destructive' as const,
    editor: 'default' as const,
    visualizador: 'secondary' as const,
    user: 'secondary' as const
  };
  return variants[role as keyof typeof variants] || 'default';
};

export const UsuarioSelector: React.FC<UsuarioSelectorProps> = ({
  usuarios,
  usuarioSelecionado,
  onUsuarioChange,
  isLoading
}) => {
  console.log('UsuarioSelector - usuarios:', usuarios);
  console.log('UsuarioSelector - isLoading:', isLoading);

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
        ) : !usuarios || usuarios.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum usuário encontrado</p>
            <p className="text-sm mt-2">
              Certifique-se de que existem usuários cadastrados no sistema
            </p>
          </div>
        ) : (
          <Select value={usuarioSelecionado} onValueChange={onUsuarioChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione um usuário" />
            </SelectTrigger>
            <SelectContent>
              {usuarios.map((usuario) => (
                <SelectItem key={usuario.id} value={usuario.user_id || usuario.id}>
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-medium truncate">{usuario.nome}</span>
                      <span className="text-sm text-muted-foreground truncate">{usuario.email}</span>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Badge variant={getRoleVariant(usuario.role)} className="text-xs">
                        {getRoleLabel(usuario.role)}
                      </Badge>
                      {!usuario.ativo && (
                        <Badge variant="secondary" className="text-xs">Inativo</Badge>
                      )}
                    </div>
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
