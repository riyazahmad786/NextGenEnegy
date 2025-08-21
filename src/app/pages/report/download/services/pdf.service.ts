import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  constructor() {}
  async generatePdf(
    htmlContent: string,
    fileName: string = 'document.pdf'
  ): Promise<jsPDF> {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    document.body.appendChild(div);

    const canvas = await html2canvas(div, { scale: 2 });
    const imgData = canvas.toDataURL('image/png', 0.9);
    const pdf = new jsPDF();
    const imgHeight = (canvas.height * 208) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, 208, imgHeight, '', 'FAST');
    pdf.save(fileName);
    document.body.removeChild(div);
    return pdf;
  }

  async generateBase64Image(htmlContent: string): Promise<string> {
    const div = document.createElement('div');
    div.innerHTML = htmlContent;
    document.body.appendChild(div);

    const canvas = await html2canvas(div, { scale: 2 });
    const imgData = canvas.toDataURL('image/png', 0.9);
    const pdf = new jsPDF();
    const imgHeight = (canvas.height * 208) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, 208, imgHeight, '', 'FAST');

    // Get the PDF as a base64 string
    const pdfBase64 = pdf.output('datauristring');
    document.body.removeChild(div);

    // Extract the base64 part from the data URI
    const base64String = pdfBase64.split(',')[1];
    return base64String;
  }
}
