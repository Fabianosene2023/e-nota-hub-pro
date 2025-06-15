
import { useEffect } from 'react';

export const useClienteAutoFill = (clienteSelecionado: any, setFormData: any) => {
  useEffect(() => {
    if (clienteSelecionado) {
      setFormData((prev: any) => ({
        ...prev,
        email_cliente: clienteSelecionado.email || '',
        telefone_cliente: clienteSelecionado.telefone || '',
        cnpj_cpf_entrega: clienteSelecionado.cpf_cnpj || '',
        inscricao_estadual_cliente: clienteSelecionado.inscricao_estadual || '',
        endereco_faturamento: `${clienteSelecionado.endereco}, ${clienteSelecionado.cidade} - ${clienteSelecionado.estado}, ${clienteSelecionado.cep}`,
        endereco_entrega: `${clienteSelecionado.endereco}, ${clienteSelecionado.cidade} - ${clienteSelecionado.estado}, ${clienteSelecionado.cep}`
      }));
    }
  }, [clienteSelecionado, setFormData]);
};
