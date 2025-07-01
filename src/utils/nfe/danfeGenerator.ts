
export interface DadosDANFE {
  chave_acesso: string;
  protocolo?: string;
  data_emissao: string;
  numero_nfe: number;
  serie: number;
  empresa: {
    razao_social: string;
    cnpj: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  cliente: {
    nome_razao_social: string;
    cpf_cnpj: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  itens: Array<{
    descricao: string;
    quantidade: number;
    valor_unitario: number;
    valor_total: number;
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

export class DANFEGenerator {
  
  /**
   * Gera HTML do DANFE para impressão
   */
  public static gerarHTMLDANFE(dados: DadosDANFE): string {
    const qrCodeUrl = this.gerarQRCode(dados.chave_acesso, dados.protocolo);
    
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DANFE - Documento Auxiliar da NF-e</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 10px; margin: 0; padding: 10px; }
        .header { text-align: center; border: 1px solid #000; padding: 10px; margin-bottom: 5px; }
        .header h1 { margin: 0; font-size: 14px; }
        .header p { margin: 2px 0; }
        .section { border: 1px solid #000; margin-bottom: 5px; padding: 5px; }
        .section-title { font-weight: bold; background-color: #f0f0f0; padding: 3px; margin: -5px -5px 5px -5px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 3px; }
        .col { flex: 1; padding-right: 10px; }
        .items-table { width: 100%; border-collapse: collapse; font-size: 8px; }
        .items-table th, .items-table td { border: 1px solid #000; padding: 2px; text-align: left; }
        .items-table th { background-color: #f0f0f0; font-weight: bold; }
        .totals { display: flex; justify-content: flex-end; }
        .totals-table { border-collapse: collapse; }
        .totals-table td { border: 1px solid #000; padding: 3px; }
        .qr-code { text-align: center; margin-top: 10px; }
        .chave-acesso { font-size: 8px; word-break: break-all; text-align: center; margin-top: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>DANFE</h1>
        <p>Documento Auxiliar da Nota Fiscal Eletrônica</p>
        <p><strong>NF-e Nº:</strong> ${dados.numero_nfe.toString().padStart(9, '0')} | <strong>Série:</strong> ${dados.serie} | <strong>Data:</strong> ${new Date(dados.data_emissao).toLocaleDateString('pt-BR')}</p>
        ${dados.protocolo ? `<p><strong>Protocolo:</strong> ${dados.protocolo}</p>` : ''}
    </div>

    <div class="section">
        <div class="section-title">EMITENTE</div>
        <div class="row">
            <div class="col"><strong>Razão Social:</strong> ${dados.empresa.razao_social}</div>
            <div class="col"><strong>CNPJ:</strong> ${this.formatarCNPJ(dados.empresa.cnpj)}</div>
        </div>
        <div class="row">
            <div class="col"><strong>Endereço:</strong> ${dados.empresa.endereco}</div>
        </div>
        <div class="row">
            <div class="col"><strong>Cidade:</strong> ${dados.empresa.cidade}</div>
            <div class="col"><strong>UF:</strong> ${dados.empresa.estado}</div>
            <div class="col"><strong>CEP:</strong> ${this.formatarCEP(dados.empresa.cep)}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">DESTINATÁRIO</div>
        <div class="row">
            <div class="col"><strong>Nome/Razão Social:</strong> ${dados.cliente.nome_razao_social}</div>
            <div class="col"><strong>CPF/CNPJ:</strong> ${this.formatarCPFCNPJ(dados.cliente.cpf_cnpj)}</div>
        </div>
        <div class="row">
            <div class="col"><strong>Endereço:</strong> ${dados.cliente.endereco}</div>
        </div>
        <div class="row">
            <div class="col"><strong>Cidade:</strong> ${dados.cliente.cidade}</div>
            <div class="col"><strong>UF:</strong> ${dados.cliente.estado}</div>
            <div class="col"><strong>CEP:</strong> ${this.formatarCEP(dados.cliente.cep)}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">PRODUTOS / SERVIÇOS</div>
        <table class="items-table">
            <thead>
                <tr>
                    <th>Descrição</th>
                    <th>Qtd</th>
                    <th>Valor Unit.</th>
                    <th>Valor Total</th>
                    <th>CFOP</th>
                </tr>
            </thead>
            <tbody>
                ${dados.itens.map(item => `
                    <tr>
                        <td>${item.descricao}</td>
                        <td>${item.quantidade.toFixed(2)}</td>
                        <td>R$ ${item.valor_unitario.toFixed(2)}</td>
                        <td>R$ ${item.valor_total.toFixed(2)}</td>
                        <td>${item.cfop}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>

    <div class="totals">
        <table class="totals-table">
            <tr>
                <td><strong>Valor dos Produtos:</strong></td>
                <td>R$ ${dados.totais.valor_produtos.toFixed(2)}</td>
            </tr>
            <tr>
                <td><strong>Valor do Frete:</strong></td>
                <td>R$ ${dados.totais.valor_frete.toFixed(2)}</td>
            </tr>
            <tr>
                <td><strong>Valor do Seguro:</strong></td>
                <td>R$ ${dados.totais.valor_seguro.toFixed(2)}</td>
            </tr>
            <tr>
                <td><strong>Valor Total da NF-e:</strong></td>
                <td><strong>R$ ${dados.totais.valor_total.toFixed(2)}</strong></td>
            </tr>
        </table>
    </div>

    ${dados.observacoes ? `
    <div class="section">
        <div class="section-title">OBSERVAÇÕES</div>
        <p>${dados.observacoes}</p>
    </div>
    ` : ''}

    <div class="qr-code">
        <img src="${qrCodeUrl}" alt="QR Code NFe" width="100" height="100">
    </div>

    <div class="chave-acesso">
        <strong>Chave de Acesso:</strong><br>
        ${this.formatarChaveAcesso(dados.chave_acesso)}
    </div>

    <script>
        // Auto-print quando carregar
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 1000);
        };
    </script>
</body>
</html>`;
  }

  /**
   * Gera URL do QR Code para consulta da NFe
   */
  private static gerarQRCode(chaveAcesso: string, protocolo?: string): string {
    // Em produção, usar a URL oficial da SEFAZ para geração do QR Code
    const urlConsulta = `https://www.nfe.fazenda.gov.br/portal/consultaRecaptcha.aspx?tipoConsulta=completa&tipoConteudo=XbSeqxE8pl8=&chNFe=${chaveAcesso}`;
    
    // Usar serviço gratuito para gerar QR Code (em produção, usar serviço próprio)
    return `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(urlConsulta)}`;
  }

  private static formatarCNPJ(cnpj: string): string {
    const numeros = cnpj.replace(/\D/g, '');
    return numeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }

  private static formatarCPF(cpf: string): string {
    const numeros = cpf.replace(/\D/g, '');
    return numeros.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }

  private static formatarCPFCNPJ(documento: string): string {
    const numeros = documento.replace(/\D/g, '');
    return numeros.length === 11 ? this.formatarCPF(documento) : this.formatarCNPJ(documento);
  }

  private static formatarCEP(cep: string): string {
    const numeros = cep.replace(/\D/g, '');
    return numeros.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }

  private static formatarChaveAcesso(chave: string): string {
    return chave.replace(/(\d{4})/g, '$1 ').trim();
  }
}
