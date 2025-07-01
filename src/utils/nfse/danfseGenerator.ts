
export interface DadosDANFSE {
  numero_nfse: string;
  codigo_verificacao: string;
  data_emissao: string;
  prestador: {
    razao_social: string;
    cnpj: string;
    inscricao_municipal: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  tomador: {
    nome_razao_social: string;
    cpf_cnpj?: string;
    endereco?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
    email?: string;
  };
  servico: {
    descricao: string;
    codigo_servico: string;
    valor_servico: number;
    aliquota_iss: number;
    valor_iss: number;
    valor_liquido: number;
  };
  retencoes?: {
    ir?: number;
    inss?: number;
    csll?: number;
    cofins?: number;
    pis?: number;
  };
}

export class DANFSEGenerator {
  
  /**
   * Gera HTML do DANFSE para impressão
   */
  public static gerarHTMLDANFSE(dados: DadosDANFSE): string {
    const urlConsulta = this.gerarURLConsulta(dados.numero_nfse, dados.codigo_verificacao);
    
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DANFSE - Documento Auxiliar da NFS-e</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 15px; }
        .header { text-align: center; border: 2px solid #000; padding: 15px; margin-bottom: 10px; }
        .header h1 { margin: 0; font-size: 18px; color: #000; }
        .header p { margin: 3px 0; }
        .section { border: 1px solid #000; margin-bottom: 10px; padding: 8px; }
        .section-title { font-weight: bold; background-color: #e6e6e6; padding: 5px; margin: -8px -8px 8px -8px; font-size: 14px; }
        .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .col { flex: 1; padding-right: 15px; }
        .values-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .values-table td { border: 1px solid #000; padding: 8px; }
        .values-table .label { background-color: #f0f0f0; font-weight: bold; width: 40%; }
        .retencoes-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .retencoes-table th, .retencoes-table td { border: 1px solid #000; padding: 5px; text-align: center; }
        .retencoes-table th { background-color: #f0f0f0; font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; font-size: 10px; }
        .codigo-verificacao { font-size: 14px; font-weight: bold; text-align: center; margin: 10px 0; }
        .url-consulta { font-size: 10px; word-break: break-all; text-align: center; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>NOTA FISCAL DE SERVIÇOS ELETRÔNICA - NFS-e</h1>
        <p><strong>Número:</strong> ${dados.numero_nfse} | <strong>Data de Emissão:</strong> ${new Date(dados.data_emissao).toLocaleDateString('pt-BR')}</p>
        <div class="codigo-verificacao">
            <strong>Código de Verificação:</strong> ${dados.codigo_verificacao}
        </div>
    </div>

    <div class="section">
        <div class="section-title">PRESTADOR DE SERVIÇOS</div>
        <div class="row">
            <div class="col"><strong>Razão Social:</strong> ${dados.prestador.razao_social}</div>
            <div class="col"><strong>CNPJ:</strong> ${this.formatarCNPJ(dados.prestador.cnpj)}</div>
        </div>
        <div class="row">
            <div class="col"><strong>Inscrição Municipal:</strong> ${dados.prestador.inscricao_municipal}</div>
        </div>
        <div class="row">
            <div class="col"><strong>Endereço:</strong> ${dados.prestador.endereco}</div>
        </div>
        <div class="row">
            <div class="col"><strong>Cidade:</strong> ${dados.prestador.cidade}</div>
            <div class="col"><strong>UF:</strong> ${dados.prestador.estado}</div>
            <div class="col"><strong>CEP:</strong> ${this.formatarCEP(dados.prestador.cep)}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">TOMADOR DE SERVIÇOS</div>
        <div class="row">
            <div class="col"><strong>Nome/Razão Social:</strong> ${dados.tomador.nome_razao_social}</div>
            ${dados.tomador.cpf_cnpj ? `<div class="col"><strong>CPF/CNPJ:</strong> ${this.formatarCPFCNPJ(dados.tomador.cpf_cnpj)}</div>` : ''}
        </div>
        ${dados.tomador.endereco ? `
        <div class="row">
            <div class="col"><strong>Endereço:</strong> ${dados.tomador.endereco}</div>
        </div>
        <div class="row">
            <div class="col"><strong>Cidade:</strong> ${dados.tomador.cidade || ''}</div>
            <div class="col"><strong>UF:</strong> ${dados.tomador.estado || ''}</div>
            <div class="col"><strong>CEP:</strong> ${dados.tomador.cep ? this.formatarCEP(dados.tomador.cep) : ''}</div>
        </div>
        ` : ''}
        ${dados.tomador.email ? `
        <div class="row">
            <div class="col"><strong>E-mail:</strong> ${dados.tomador.email}</div>
        </div>
        ` : ''}
    </div>

    <div class="section">
        <div class="section-title">DISCRIMINAÇÃO DOS SERVIÇOS</div>
        <p><strong>Código do Serviço:</strong> ${dados.servico.codigo_servico}</p>
        <p style="margin-top: 10px; line-height: 1.4;">${dados.servico.descricao}</p>
    </div>

    <div class="section">
        <div class="section-title">VALORES</div>
        <table class="values-table">
            <tr>
                <td class="label">Valor dos Serviços</td>
                <td>R$ ${dados.servico.valor_servico.toFixed(2)}</td>
            </tr>
            <tr>
                <td class="label">Alíquota ISS</td>
                <td>${dados.servico.aliquota_iss.toFixed(2)}%</td>
            </tr>
            <tr>
                <td class="label">Valor do ISS</td>
                <td>R$ ${dados.servico.valor_iss.toFixed(2)}</td>
            </tr>
            <tr>
                <td class="label"><strong>Valor Líquido da NFS-e</strong></td>
                <td><strong>R$ ${dados.servico.valor_liquido.toFixed(2)}</strong></td>
            </tr>
        </table>
    </div>

    ${dados.retencoes && this.temRetencoes(dados.retencoes) ? `
    <div class="section">
        <div class="section-title">RETENÇÕES</div>
        <table class="retencoes-table">
            <thead>
                <tr>
                    <th>Tributo</th>
                    <th>Valor Retido</th>
                </tr>
            </thead>
            <tbody>
                ${dados.retencoes.ir ? `<tr><td>Imposto de Renda</td><td>R$ ${dados.retencoes.ir.toFixed(2)}</td></tr>` : ''}
                ${dados.retencoes.inss ? `<tr><td>INSS</td><td>R$ ${dados.retencoes.inss.toFixed(2)}</td></tr>` : ''}
                ${dados.retencoes.csll ? `<tr><td>CSLL</td><td>R$ ${dados.retencoes.csll.toFixed(2)}</td></tr>` : ''}
                ${dados.retencoes.cofins ? `<tr><td>COFINS</td><td>R$ ${dados.retencoes.cofins.toFixed(2)}</td></tr>` : ''}
                ${dados.retencoes.pis ? `<tr><td>PIS</td><td>R$ ${dados.retencoes.pis.toFixed(2)}</td></tr>` : ''}
            </tbody>
        </table>
    </div>
    ` : ''}

    <div class="footer">
        <p><strong>Esta NFS-e foi emitida eletronicamente e possui validade jurídica</strong></p>
        <div class="url-consulta">
            <strong>Consulte a autenticidade em:</strong><br>
            ${urlConsulta}
        </div>
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
   * Gera PDF do DANFSE usando html2canvas e jsPDF
   */
  public static async gerarPDFDANFSE(dados: DadosDANFSE): Promise<Blob> {
    const { default: html2canvas } = await import('html2canvas');
    const { jsPDF } = await import('jspdf');

    // Criar elemento temporário com HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = this.gerarHTMLDANFSE(dados);
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '794px'; // A4 width in pixels at 96 DPI
    document.body.appendChild(tempDiv);

    try {
      // Converter para canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      // Criar PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);

      return pdf.output('blob');

    } finally {
      // Remover elemento temporário
      document.body.removeChild(tempDiv);
    }
  }

  private static gerarURLConsulta(numeroNfse: string, codigoVerificacao: string): string {
    // URL genérica - em produção, usar a URL específica da prefeitura
    return `https://www.prefeitura.sp.gov.br/nfse/consulta?numero=${numeroNfse}&codigo=${codigoVerificacao}`;
  }

  private static temRetencoes(retencoes: any): boolean {
    return retencoes && (retencoes.ir || retencoes.inss || retencoes.csll || retencoes.cofins || retencoes.pis);
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
}
