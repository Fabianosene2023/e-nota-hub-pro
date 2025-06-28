
import { CadastroPrestadoresForm } from './CadastroPrestadoresForm';
import { PrestadoresTable } from './PrestadoresTable';

export const CadastroPrestadores = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Prestadores de Serviço</h2>
        <p className="text-muted-foreground">
          Gerencie os prestadores de serviço para emissão de NFSe
        </p>
      </div>

      <CadastroPrestadoresForm />
      <PrestadoresTable />
    </div>
  );
};
