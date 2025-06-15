
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';
import { UsuariosTable } from './CadastroUsuarios/UsuariosTable';
import { UsuarioFormDialog } from './CadastroUsuarios/UsuarioFormDialog';
import { useUserProfiles } from '@/hooks/useUserProfiles';
import { useAuth } from '@/contexts/AuthContext';

export const CadastroUsuarios = () => {
  const { profile } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<any>(null);
  
  const { data: usuarios, isLoading } = useUserProfiles(profile?.empresa_id);

  const handleEdit = (usuario: any) => {
    setEditingUsuario(usuario);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUsuario(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              <div>
                <CardTitle>Cadastro de Usuários</CardTitle>
                <CardDescription>
                  Gerencie os usuários do sistema
                </CardDescription>
              </div>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Usuário
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <UsuariosTable 
            usuarios={usuarios || []} 
            isLoading={isLoading}
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>

      <UsuarioFormDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        usuario={editingUsuario}
      />
    </div>
  );
};
