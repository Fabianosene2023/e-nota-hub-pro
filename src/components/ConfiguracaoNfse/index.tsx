
import { ConfiguracaoNfseForm } from './ConfiguracaoNfseForm';

export const ConfiguracaoNfse = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuração NFSe</h2>
        <p className="text-muted-foreground">
          Configure as informações necessárias para emissão de NFSe por município
        </p>
      </div>

      <ConfiguracaoNfseForm />
    </div>
  );
};
