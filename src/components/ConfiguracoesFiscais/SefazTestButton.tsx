
import React from 'react';
import { Button } from "@/components/ui/button";
import { useTestarConexaoSefaz } from '@/hooks/useConfiguracoesSefaz';
import { TestTube } from "lucide-react";

interface SefazTestButtonProps {
  empresaId: string;
}

export const SefazTestButton: React.FC<SefazTestButtonProps> = ({ empresaId }) => {
  const testarConexao = useTestarConexaoSefaz();

  const handleTestarConexao = async () => {
    await testarConexao.mutateAsync(empresaId);
  };

  return (
    <Button 
      type="button" 
      variant="outline"
      onClick={handleTestarConexao}
      disabled={testarConexao.isPending}
      className="flex items-center gap-2"
    >
      <TestTube className="h-4 w-4" />
      {testarConexao.isPending ? 'Testando...' : 'Testar Conexão'}
    </Button>
  );
};
