
export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
}

export interface UserPermission {
  id: string;
  user_id: string;
  permission_id: string;
  granted: boolean;
  granted_by: string;
  granted_at: string;
}

export interface PermissionModule {
  name: string;
  permissions: Permission[];
}

export const PERMISSION_MODULES: PermissionModule[] = [
  {
    name: 'Dashboard',
    permissions: [
      { id: 'dashboard_view', name: 'Visualizar Dashboard', description: 'Pode visualizar o dashboard principal', module: 'dashboard' },
    ]
  },
  {
    name: 'Empresas',
    permissions: [
      { id: 'empresas_view', name: 'Visualizar Empresas', description: 'Pode visualizar empresas', module: 'empresas' },
      { id: 'empresas_create', name: 'Criar Empresas', description: 'Pode criar novas empresas', module: 'empresas' },
      { id: 'empresas_edit', name: 'Editar Empresas', description: 'Pode editar empresas existentes', module: 'empresas' },
      { id: 'empresas_delete', name: 'Excluir Empresas', description: 'Pode excluir empresas', module: 'empresas' },
    ]
  },
  {
    name: 'Notas Fiscais',
    permissions: [
      { id: 'nfe_view', name: 'Visualizar NFe', description: 'Pode visualizar notas fiscais eletrônicas', module: 'nfe' },
      { id: 'nfe_create', name: 'Emitir NFe', description: 'Pode emitir novas NFe', module: 'nfe' },
      { id: 'nfe_cancel', name: 'Cancelar NFe', description: 'Pode cancelar NFe', module: 'nfe' },
      { id: 'nfce_view', name: 'Visualizar NFCe', description: 'Pode visualizar NFCe', module: 'nfce' },
      { id: 'nfce_create', name: 'Emitir NFCe', description: 'Pode emitir NFCe', module: 'nfce' },
    ]
  },
  {
    name: 'Cadastros',
    permissions: [
      { id: 'clientes_view', name: 'Visualizar Clientes', description: 'Pode visualizar clientes', module: 'clientes' },
      { id: 'clientes_create', name: 'Criar Clientes', description: 'Pode criar novos clientes', module: 'clientes' },
      { id: 'clientes_edit', name: 'Editar Clientes', description: 'Pode editar clientes', module: 'clientes' },
      { id: 'produtos_view', name: 'Visualizar Produtos', description: 'Pode visualizar produtos', module: 'produtos' },
      { id: 'produtos_create', name: 'Criar Produtos', description: 'Pode criar novos produtos', module: 'produtos' },
      { id: 'produtos_edit', name: 'Editar Produtos', description: 'Pode editar produtos', module: 'produtos' },
    ]
  },
  {
    name: 'Configurações',
    permissions: [
      { id: 'config_empresa', name: 'Configurar Empresa', description: 'Pode alterar configurações da empresa', module: 'configuracoes' },
      { id: 'config_usuarios', name: 'Gerenciar Usuários', description: 'Pode gerenciar usuários do sistema', module: 'configuracoes' },
      { id: 'config_permissoes', name: 'Gerenciar Permissões', description: 'Pode gerenciar permissões de usuários', module: 'configuracoes' },
      { id: 'config_fiscais', name: 'Configurações Fiscais', description: 'Pode alterar configurações fiscais', module: 'configuracoes' },
    ]
  }
];
