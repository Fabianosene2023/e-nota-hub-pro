
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
  created_at: string;
}

interface UsuariosTableProps {
  usuarios: Usuario[];
  isLoading: boolean;
  onEdit: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
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

export const UsuariosTable: React.FC<UsuariosTableProps> = ({
  usuarios,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum usuário cadastrado
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Perfil</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Data Criação</TableHead>
          <TableHead className="w-[100px]">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usuarios.map((usuario) => (
          <TableRow key={usuario.id}>
            <TableCell className="font-medium">{usuario.nome}</TableCell>
            <TableCell>{usuario.email}</TableCell>
            <TableCell>
              <Badge variant={getRoleVariant(usuario.role) as any}>
                {getRoleLabel(usuario.role)}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={usuario.ativo ? 'default' : 'secondary'}>
                {usuario.ativo ? 'Ativo' : 'Inativo'}
              </Badge>
            </TableCell>
            <TableCell>
              {format(new Date(usuario.created_at), 'dd/MM/yyyy', { locale: ptBR })}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(usuario)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(usuario)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
