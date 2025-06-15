
/**
 * Configurações padrão para integração SEFAZ
 */
export const SEFAZ_DEFAULT_CONFIG = {
  // Configurações básicas
  ambiente: 'homologacao' as const,
  timeout_sefaz: 30000, // 30 segundos
  tentativas_reenvio: 3,
  
  // Séries padrão
  serie_nfe: 1,
  serie_nfce: 1,
  
  // Numeração inicial
  proximo_numero_nfe: 1,
  proximo_numero_nfce: 1,
  
  // Configurações por UF (exemplos mais comuns)
  UF_CONFIGS: {
    'SP': {
      nome: 'São Paulo',
      codigo_uf: '35',
      regime_especial: false
    },
    'RJ': {
      nome: 'Rio de Janeiro', 
      codigo_uf: '33',
      regime_especial: false
    },
    'MG': {
      nome: 'Minas Gerais',
      codigo_uf: '31', 
      regime_especial: false
    },
    'RS': {
      nome: 'Rio Grande do Sul',
      codigo_uf: '43',
      regime_especial: false
    }
  }
} as const;

/**
 * Cria configuração padrão para uma empresa
 */
export const createDefaultSefazConfig = (empresaId: string, uf: string = 'SP') => {
  return {
    empresa_id: empresaId,
    ...SEFAZ_DEFAULT_CONFIG,
    uf_empresa: uf,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

/**
 * Validações básicas de configuração SEFAZ
 */
export const validateSefazConfig = (config: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!config.empresa_id) {
    errors.push('ID da empresa é obrigatório');
  }
  
  if (!['homologacao', 'producao'].includes(config.ambiente)) {
    errors.push('Ambiente deve ser homologação ou produção');
  }
  
  if (config.serie_nfe < 1 || config.serie_nfe > 999) {
    errors.push('Série NFe deve estar entre 1 e 999');
  }
  
  if (config.serie_nfce < 1 || config.serie_nfce > 999) {
    errors.push('Série NFCe deve estar entre 1 e 999');
  }
  
  if (config.timeout_sefaz < 5000 || config.timeout_sefaz > 120000) {
    errors.push('Timeout deve estar entre 5 e 120 segundos');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};
