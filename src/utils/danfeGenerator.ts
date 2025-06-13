
import jsPDF from 'jspdf';

export interface DadosDANFE {
  chave_acesso: string;
  numero: number;
  serie: number;
  data_emissao: string;
  valor_total: number;
  empresa: {
    razao_social: string;
    nome_fantasia?: string;
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
    codigo: string;
    descricao: string;
    quantidade: number;
    valor_unitario: number;
    valor_total: number;
  }>;
}

export class DANFEGenerator {
  public static async gerarDANFE(dados: DadosDANFE): Promise<Uint8Array> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    
    // Configurações
    const margin = 10;
    const lineHeight = 5;
    let currentY = margin;

    // Título DANFE
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DOCUMENTO AUXILIAR DA NOTA FISCAL ELETRÔNICA', pageWidth / 2, currentY, { align: 'center' });
    currentY += lineHeight * 2;

    // Chave de Acesso
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`CHAVE DE ACESSO: ${dados.chave_acesso}`, margin, currentY);
    currentY += lineHeight * 2;

    // Dados da Empresa (Emitente)
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DADOS DO EMITENTE', margin, currentY);
    currentY += lineHeight;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Razão Social: ${dados.empresa.razao_social}`, margin, currentY);
    currentY += lineHeight;
    
    if (dados.empresa.nome_fantasia) {
      pdf.text(`Nome Fantasia: ${dados.empresa.nome_fantasia}`, margin, currentY);
      currentY += lineHeight;
    }
    
    pdf.text(`CNPJ: ${dados.empresa.cnpj}`, margin, currentY);
    currentY += lineHeight;
    pdf.text(`Endereço: ${dados.empresa.endereco}`, margin, currentY);
    currentY += lineHeight;
    pdf.text(`${dados.empresa.cidade} - ${dados.empresa.estado} - CEP: ${dados.empresa.cep}`, margin, currentY);
    currentY += lineHeight * 2;

    // Dados do Destinatário
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DADOS DO DESTINATÁRIO', margin, currentY);
    currentY += lineHeight;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Nome/Razão Social: ${dados.cliente.nome_razao_social}`, margin, currentY);
    currentY += lineHeight;
    pdf.text(`CPF/CNPJ: ${dados.cliente.cpf_cnpj}`, margin, currentY);
    currentY += lineHeight;
    pdf.text(`Endereço: ${dados.cliente.endereco}`, margin, currentY);
    currentY += lineHeight;
    pdf.text(`${dados.cliente.cidade} - ${dados.cliente.estado} - CEP: ${dados.cliente.cep}`, margin, currentY);
    currentY += lineHeight * 2;

    // Dados da NFe
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DADOS DA NOTA FISCAL', margin, currentY);
    currentY += lineHeight;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Número: ${dados.numero.toString().padStart(9, '0')}`, margin, currentY);
    pdf.text(`Série: ${dados.serie}`, margin + 60, currentY);
    currentY += lineHeight;
    pdf.text(`Data de Emissão: ${new Date(dados.data_emissao).toLocaleDateString('pt-BR')}`, margin, currentY);
    currentY += lineHeight * 2;

    // Itens da Nota
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ITENS DA NOTA FISCAL', margin, currentY);
    currentY += lineHeight;

    // Cabeçalho da tabela
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Código', margin, currentY);
    pdf.text('Descrição', margin + 25, currentY);
    pdf.text('Qtd', margin + 100, currentY);
    pdf.text('Vlr Unit', margin + 120, currentY);
    pdf.text('Vlr Total', margin + 150, currentY);
    currentY += lineHeight;

    // Linha separadora
    pdf.line(margin, currentY - 2, pageWidth - margin, currentY - 2);

    // Itens
    pdf.setFont('helvetica', 'normal');
    dados.itens.forEach((item) => {
      if (currentY > pageHeight - 30) {
        pdf.addPage();
        currentY = margin;
      }

      pdf.text(item.codigo, margin, currentY);
      pdf.text(item.descricao.substring(0, 30), margin + 25, currentY);
      pdf.text(item.quantidade.toString(), margin + 100, currentY);
      pdf.text(`R$ ${item.valor_unitario.toFixed(2)}`, margin + 120, currentY);
      pdf.text(`R$ ${item.valor_total.toFixed(2)}`, margin + 150, currentY);
      currentY += lineHeight;
    });

    // Total
    currentY += lineHeight;
    pdf.line(margin, currentY - 2, pageWidth - margin, currentY - 2);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`VALOR TOTAL: R$ ${dados.valor_total.toFixed(2)}`, pageWidth - margin - 50, currentY);

    // Observações
    currentY += lineHeight * 2;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Este documento é uma representação gráfica da NFe e foi gerado com base no arquivo XML autorizado pela SEFAZ.', margin, currentY);

    return pdf.output('arraybuffer') as Uint8Array;
  }
}
