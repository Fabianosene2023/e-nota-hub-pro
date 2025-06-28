import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Building, Users, Package, FileText, Settings, BarChart3, TestTube, ChevronDown, ChevronRight, LogOut, User } from "lucide-react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    current: false,
  },
  {
    name: "Empresas",
    href: "/empresas",
    icon: Building,
    current: false,
  },
  {
    name: "Notas Fiscais",
    href: "/notas",
    icon: FileText,
    current: false,
    submenu: [
      { name: "Emissão NFe", href: "/notas/nfe" },
      { name: "Emissão NFCe", href: "/notas/nfce" },
      { name: "Emissão CTe", href: "/notas/cte" },
      { name: "Emissão NFe Ajuste", href: "/notas/nfe-ajuste" },
      { name: "Emissão NFe Complementar", href: "/notas/nfe-complementar" },
      { name: "Emissão NFe Importação", href: "/notas/nfe-importacao" },
      { name: "Emissão NFe Exportação", href: "/notas/nfe-exportacao" },
      { name: "Consulta de Documentos", href: "/notas/consulta" },
      { name: "Notas Recebidas (MDF-e)", href: "/notas/recebidas" },
    ]
  },
  {
    name: "NFSe - Serviços",
    href: "/nfse",
    icon: FileText,
    current: false,
  },
  {
    name: "Cadastros",
    href: "/cadastros",
    icon: Package,
    current: false,
    submenu: [
      { name: "Clientes", href: "/clientes" },
      { name: "Produtos", href: "/produtos/lista" },
      { name: "Serviços", href: "/produtos/servicos" },
      { name: "Marcas", href: "/produtos/marcas" },
      { name: "Categorias", href: "/produtos/categorias" },
      { name: "Unidades de Medida", href: "/produtos/unidades" },
      { name: "Fornecedores", href: "/produtos/fornecedores" },
      { name: "Transportadoras", href: "/produtos/transportadoras" },
    ]
  },
  {
    name: "Configurações",
    href: "/configuracoes",
    icon: Settings,
    current: false,
    submenu: [
      { name: "Configurações da Empresa", href: "/configuracoes/empresa" },
      { name: "Cadastro de Usuários", href: "/configuracoes/usuarios" },
      { name: "Configuração de Permissões", href: "/configuracoes/permissoes" },
      { name: "Consulta de Log de Uso", href: "/configuracoes/logs" },
      { name: "Configurações Fiscais", href: "/configuracoes/fiscais" },
      { name: "NF-E", href: "/configuracoes/nfe" },
      { name: "CT-E", href: "/configuracoes/cte" },
      { name: "NFC-E", href: "/configuracoes/nfce" },
      { name: "NFS-E", href: "/configuracoes/nfse" },
      { name: "Matriz Fiscal", href: "/configuracoes/matriz-fiscal" },
      { name: "Natureza de Operação", href: "/configuracoes/natureza-operacao" },
    ]
  },
  {
    name: "Relatórios",
    href: "/relatorios",
    icon: BarChart3,
    current: false,
    submenu: [
      { name: "Relatório de Produtos", href: "/relatorios/produtos" },
      { name: "Relatório de Clientes", href: "/relatorios/clientes" },
      { name: "Relatório de Estoque", href: "/relatorios/estoque" },
    ]
  },
  {
    name: "Teste API NFe",
    href: "/teste-api",
    icon: TestTube,
    current: false,
  },
]

export const Layout = () => {
  const location = useLocation()
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const { user, profile, signOut } = useAuth()

  const toggleSubmenu = (menuName: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    )
  }

  const isSubmenuExpanded = (menuName: string) => expandedMenus.includes(menuName)

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Building className="h-6 w-6" />
              <span className="">Sistema Fiscal</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.submenu && item.submenu.some(sub => location.pathname === sub.href))
                const hasSubmenu = item.submenu && item.submenu.length > 0
                const isExpanded = isSubmenuExpanded(item.name)

                return (
                  <div key={item.name}>
                    {hasSubmenu ? (
                      <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={cn(
                          "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                          isActive && "bg-muted text-primary"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          {item.name}
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    ) : (
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                          isActive && "bg-muted text-primary"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    )}
                    
                    {hasSubmenu && isExpanded && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.submenu.map((subitem) => {
                          const isSubActive = location.pathname === subitem.href
                          return (
                            <Link
                              key={subitem.name}
                              to={subitem.href}
                              className={cn(
                                "block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-primary hover:bg-muted/50",
                                isSubActive && "bg-muted text-primary font-medium"
                              )}
                            >
                              {subitem.name}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
          
          <div className="mt-auto p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  <span className="truncate">{profile?.nome || user?.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold md:text-2xl">Sistema de Gestão Fiscal</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
