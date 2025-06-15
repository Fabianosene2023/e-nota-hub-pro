
// Simulação de integração com SEFAZ para emissão de CT-e
export interface RetornoSefazCte {
  success: boolean;
  chave_acesso?: string;
  protocolo?: string;
  motivo?: string;
}

export const emitirCte = async (cteId: string): Promise<RetornoSefazCte> => {
  console.log('Simulando emissão de CT-e com id:', cteId);
  
  // Simular delay da API da SEFAZ
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simular resposta da SEFAZ (90% de sucesso)
  const sucesso = Math.random() > 0.1;
  
  if (sucesso) {
    const chaveAcesso = gerarChaveAcessoCte();
    const protocolo = gerarProtocoloCte();
    
    return {
      success: true,
      chave_acesso: chaveAcesso,
      protocolo: protocolo,
    };
  } else {
    return {
      success: false,
      motivo: 'Erro simulado na validação dos dados do CT-e na SEFAZ.',
    };
  }
};

const gerarChaveAcessoCte = (): string => {
  const estado = '35'; // SP
  const ano = new Date().getFullYear().toString().slice(-2);
  const mes = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const cnpj = '12345678000190'; // Simular CNPJ
  const modelo = '57'; // Modelo de CT-e
  const serie = '1'.toString().padStart(3, '0');
  const numero = Math.floor(Math.random() * 100000000).toString().padStart(9, '0');
  const forma_emissao = '1';
  const codigo_numerico = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
  
  const chave_sem_dv = `${estado}${ano}${mes}${cnpj}${modelo}${serie}${numero}${forma_emissao}${codigo_numerico}`;
  const dv = calcularDVChaveAcesso(chave_sem_dv);
  
  return `${chave_sem_dv}${dv}`;
};

const calcularDVChaveAcesso = (chave: string): string => {
    const sequencia = '4329876543298765432987654329876543298765432';
    let soma = 0;
    
    for (let i = 0; i < chave.length; i++) {
        soma += parseInt(chave[i]) * parseInt(sequencia[i]);
    }
    
    const resto = soma % 11;
    return resto < 2 ? '0' : (11 - resto).toString();
};

const gerarProtocoloCte = (): string => {
  return `335${Date.now().toString().slice(-12)}`;
};
