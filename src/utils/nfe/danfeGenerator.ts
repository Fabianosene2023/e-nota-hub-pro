
export interface DadosDANFE {
  chave_acesso: string;
  protocolo?: string;
  data_emissao: string;
  numero_nfe: number;
  serie: number;
  empresa: {
    cnpj: string;
    razao_social: string;
    nome_fantasia?: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  cliente: {
    cpf_cnpj: string;
    nome_razao_social: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  itens: Array<{
    codigo: string;
    descricao: string;
    quantidade: number;
    valor_unitario: number;
    valor_total: number;
    ncm?: string;
    cfop: string;
  }>;
  totais: {
    valor_produtos: number;
    valor_frete: number;
    valor_seguro: number;
    valor_total: number;
  };
  observacoes?: string;
}

/**
 * DANFE Generator for NFe v4.00
 */
export class DANFEGenerator {
  
  /**
   * Generate DANFE HTML with QRCode and protocol
   */
  public static gerarHTMLDANFE(dados: DadosDANFE): string {
    const qrCodeUrl = this.gerarQRCode(dados.chave_acesso, dados.protocolo);
    
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DANFE - Documento Auxiliar da Nota Fiscal Eletrônica</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .header { border: 1px solid #000; padding: 10px; margin-bottom: 5px; }
        .title { text-align: center; font-weight: bold; font-size: 16px; margin-bottom: 10px; }
        .empresa { font-weight: bold; font-size: 14px; }
        .chave { font-size: 10px; word-break: break-all; }
        .protocolo { text-align: center; font-weight: bold; margin: 10px 0; }
        .qrcode { text-align: center; margin: 20px 0; }
        .section { border: 1px solid #000; margin-bottom: 5px; }
        .section-title { background-color: #f0f0f0; padding: 5px; font-weight: bold; border-bottom: 1px solid #000; }
        .section-content { padding: 10px; }
        .item-row { border-bottom: 1px solid #ccc; padding: 5px 0; }
        .totals { text-align: right; font-weight: bold; }
        .footer { margin-top: 20px; text-align: center; font-size: 10px; }
        .two-columns { display: flex; gap: 10px; }
        .column { flex: 1; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Cabeçalho -->
        <div class="header">
            <div class="title">DANFE - Documento Auxiliar da Nota Fiscal Eletrônica</div>
            <div class="two-columns">
                <div class="column">
                    <div class="empresa">${dados.empresa.razao_social}</div>
                    ${dados.empresa.nome_fantasia ? `<div>${dados.empresa.nome_fantasia}</div>` : ''}
                    <div>CNPJ: ${this.formatarCNPJ(dados.empresa.cnpj)}</div>
                    <div>${dados.empresa.endereco}</div>
                    <div>${dados.empresa.cidade}/${dados.empresa.estado} - CEP: ${dados.empresa.cep}</div>
                </div>
                <div class="column" style="text-align: right;">
                    <div><strong>NF-e Nº:</strong> ${dados.numero_nfe.toString().padStart(9, '0')}</div>
                    <div><strong>Série:</strong> ${dados.serie}</div>
                    <div><strong>Data de Emissão:</strong> ${this.formatarData(dados.data_emissao)}</div>
                    ${dados.protocolo ? `<div><strong>Protocolo:</strong> ${dados.protocolo}</div>` : ''}
                </div>
            </div>
        </div>

        <!-- Chave de Acesso -->
        <div class="section">
            <div class="section-title">CHAVE DE ACESSO</div>
            <div class="section-content">
                <div class="chave">${this.formatarChaveAcesso(dados.chave_acesso)}</div>
            </div>
        </div>

        <!-- Destinatário -->
        <div class="section">
            <div class="section-title">DESTINATÁRIO/REMETENTE</div>
            <div class="section-content">
                <div><strong>${dados.cliente.nome_razao_social}</strong></div>
                <div>CPF/CNPJ: ${this.formatarCpfCnpj(dados.cliente.cpf_cnpj)}</div>
                <div>${dados.cliente.endereco}</div>
                <div>${dados.cliente.cidade}/${dados.cliente.estado} - CEP: ${dados.cliente.cep}</div>
            </div>
        </div>

        <!-- Produtos/Serviços -->
        <div class="section">
            <div class="section-title">DADOS DOS PRODUTOS/SERVIÇOS</div>
            <div class="section-content">
                <div style="display: grid; grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr; gap: 10px; font-weight: bold; border-bottom: 2px solid #000; padding-bottom: 5px; margin-bottom: 10px;">
                    <div>Código</div>
                    <div>Descrição</div>
                    <div>NCM/SH</div>
                    <div>Qtde</div>
                    <div>Vl. Unit.</div>
                    <div>Vl. Total</div>
                </div>
                ${dados.itens.map(item => `
                    <div class="item-row" style="display: grid; grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1fr; gap: 10px;">
                        <div>${item.codigo}</div>
                        <div>${item.descricao}</div>
                        <div>${item.ncm || '-'}</div>
                        <div>${item.quantidade.toFixed(2)}</div>
                        <div>R$ ${item.valor_unitario.toFixed(2)}</div>
                        <div>R$ ${item.valor_total.toFixed(2)}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Totais -->
        <div class="section">
            <div class="section-title">CÁLCULO DO IMPOSTO</div>
            <div class="section-content">
                <div class="two-columns">
                    <div class="column">
                        <div>Base de Cálculo do ICMS: R$ 0,00</div>
                        <div>Valor do ICMS: R$ 0,00</div>
                        <div>Base de Cálculo ICMS ST: R$ 0,00</div>
                        <div>Valor do ICMS ST: R$ 0,00</div>
                    </div>
                    <div class="column">
                        <div>Valor Total dos Produtos: R$ ${dados.totais.valor_produtos.toFixed(2)}</div>
                        <div>Valor do Frete: R$ ${dados.totais.valor_frete.toFixed(2)}</div>
                        <div>Valor do Seguro: R$ ${dados.totais.valor_seguro.toFixed(2)}</div>
                        <div class="totals">Valor Total da NF-e: R$ ${dados.totais.valor_total.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Observações -->
        ${dados.observacoes ? `
        <div class="section">
            <div class="section-title">INFORMAÇÕES COMPLEMENTARES</div>
            <div class="section-content">
                ${dados.observacoes}
            </div>
        </div>
        ` : ''}

        <!-- QR Code -->
        <div class="qrcode">
            <div><strong>Consulte pela Chave de Acesso em:</strong></div>
            <div>https://www.nfe.fazenda.gov.br/portal/consultaRecaptcha.aspx</div>
            <div style="margin-top: 10px;">
                <img src="${qrCodeUrl}" alt="QR Code" style="max-width: 200px;">
            </div>
        </div>

        <!-- Protocolo de Autorização -->
        ${dados.protocolo ? `
        <div class="protocolo">
            <strong>Protocolo de Autorização: ${dados.protocolo}</strong><br>
            Data de Autorização: ${this.formatarData(dados.data_emissao)}
        </div>
        ` : ''}

        <div class="footer">
            Este documento é uma representação gráfica da NF-e e foi gerado em ${new Date().toLocaleString('pt-BR')}
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Generate QR Code URL for NFe consultation
   */
  private static gerarQRCode(chaveAcesso: string, protocolo?: string): string {
    // Em produção, usar biblioteca para gerar QR Code real
    const consultaUrl = `https://www.nfe.fazenda.gov.br/portal/consultaRecaptcha.aspx?tipoConsulta=completa&tipoConteudo=XbSeqxE8pl8=&chave=${chaveAcesso}`;
    return `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="white"/><text x="100" y="100" text-anchor="middle" fill="black" font-size="12">QR Code: ${chaveAcesso.substring(0, 8)}...</text></svg>`)}`;
  }

  private static formatarCNPJ(cnpj: string): string {
    const numeros = cnpj.replace(/\D/g, '');
    return numeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  private static formatarCpfCnpj(cpfCnpj: string): string {
    const numeros = cpfCnpj.replace(/\D/g, '');
    if (numeros.length === 11) {
      return numeros.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
    } else {
      return numeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
    }
  }

  private static formatarChaveAcesso(chave: string): string {
    return chave.replace(/(\d{4})/g, '$1 ').trim();
  }

  private static formatarData(dataISO: string): string {
    return new Date(dataISO).toLocaleDateString('pt-BR');
  }
}
