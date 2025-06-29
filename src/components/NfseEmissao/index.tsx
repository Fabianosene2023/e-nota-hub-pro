
import React, { useState } from 'react';
import NfseEmissaoPage from '@/pages/NfseEmissaoPage';
import { NfseResultCard } from './NfseResultCard';
import { useEmitirNfseUberaba } from '@/hooks/useNfseUberaba';

export const NfseEmissao = () => {
  const [resultadoEmissao, setResultadoEmissao] = useState(null);
  const emitirNfse = useEmitirNfseUberaba();

  React.useEffect(() => {
    if (emitirNfse.isSuccess && emitirNfse.data) {
      setResultadoEmissao(emitirNfse.data);
    }
  }, [emitirNfse.isSuccess, emitirNfse.data]);

  return (
    <div className="space-y-6">
      <NfseEmissaoPage />
      
      {resultadoEmissao && (
        <div className="mt-6">
          <NfseResultCard data={{
            numero_nfse: resultadoEmissao.numero_nfse,
            codigo_verificacao: resultadoEmissao.codigo_verificacao,
            valor_total: resultadoEmissao.valor_total,
            data_emissao: resultadoEmissao.data_emissao
          }} />
        </div>
      )}
    </div>
  );
};
