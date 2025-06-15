
import React, { useState } from 'react';
import { Shield, Users } from 'lucide-react';
import { UsuarioSelector } from './ConfiguracaoPermissoes/UsuarioSelector';
import { PermissoesTable } from './ConfiguracaoPermissoes/PermissoesTable';
import { useUserProfiles } from '@/hooks/useUserProfiles';
import { useUserPermissions, useUpdateUserPermission } from '@/hooks/usePermissoes';
import { useAuth } from '@/contexts/AuthContext';

export const ConfiguracaoPermissoes = () => {
  const { profile } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  
  console.log('ConfiguracaoPermissoes - profile:', profile);
  
  // Busca usuários - se não tem empresa_id, busca todos (admin geral)
  const { data: usuarios = [], isLoading: loadingUsuarios, error: usuariosError } = useUserProfiles(profile?.empresa_id);
  const { data: userPermissions = {}, isLoading: loadingPermissions } = useUserPermissions(selectedUserId);
  const updatePermission = useUpdateUserPermission();

  console.log('ConfiguracaoPermissoes - usuarios:', usuarios);
  console.log('ConfiguracaoPermissoes - loadingUsuarios:', loadingUsuarios);
  console.log('ConfiguracaoPermissoes - usuariosError:', usuariosError);

  const handlePermissionChange = (permissionId: string, granted: boolean) => {
    if (!selectedUserId) return;
    
    updatePermission.mutate({
      userId: selectedUserId,
      permissionId,
      granted
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Configuração de Permissões</h1>
          <p className="text-muted-foreground">
            Gerencie as permissões específicas de cada usuário no sistema
          </p>
        </div>
      </div>

      {usuariosError && (
        <div className="bg-destructive/15 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive font-medium">Erro ao carregar usuários:</p>
          <p className="text-destructive text-sm">{usuariosError.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <UsuarioSelector
            usuarios={usuarios}
            usuarioSelecionado={selectedUserId}
            onUsuarioChange={setSelectedUserId}
            isLoading={loadingUsuarios}
          />
        </div>
        
        <div className="lg:col-span-2">
          <PermissoesTable
            selectedUserId={selectedUserId}
            userPermissions={userPermissions}
            onPermissionChange={handlePermissionChange}
            isLoading={loadingPermissions}
          />
        </div>
      </div>
    </div>
  );
};
