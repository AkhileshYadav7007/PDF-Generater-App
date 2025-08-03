import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FormData } from '@/types';

export const generatePDF = async (formData: FormData, elementId?: string): Promise<void> => {
  try {
    if (elementId) {
      // Generate PDF from HTML element (for preview page)
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Element not found');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${formData.name.replace(/\s+/g, '_')}_details.pdf`);
    } else {
      // Generate PDF programmatically (for direct download from form)
      const pdf = new jsPDF();
      
      // Set font
      pdf.setFont('helvetica');
      
      // Title
      pdf.setFontSize(20);
      pdf.setTextColor(40, 40, 40);
      pdf.text('Personal Details', 20, 30);
      
      // Draw a line under title
      pdf.setLineWidth(0.5);
      pdf.line(20, 35, 190, 35);
      
      let yPosition = 50;
      
      // Personal Information
      pdf.setFontSize(16);
      pdf.setTextColor(60, 60, 60);
      pdf.text('Personal Information', 20, yPosition);
      yPosition += 15;
      
      pdf.setFontSize(12);
      pdf.setTextColor(80, 80, 80);
      
      // Name
      pdf.setFont('helvetica', 'bold');
      pdf.text('Name:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(formData.name, 50, yPosition);
      yPosition += 10;
      
      // Email
      pdf.setFont('helvetica', 'bold');
      pdf.text('Email:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(formData.email, 50, yPosition);
      yPosition += 10;
      
      // Phone
      pdf.setFont('helvetica', 'bold');
      pdf.text('Phone:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(formData.phone, 50, yPosition);
      yPosition += 10;
      
      // Position
      pdf.setFont('helvetica', 'bold');
      pdf.text('Position:', 20, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(formData.position, 50, yPosition);
      yPosition += 20;
      
      // Description
      if (formData.description) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Description:', 20, yPosition);
        yPosition += 10;
        
        pdf.setFont('helvetica', 'normal');
        const splitDescription = pdf.splitTextToSize(formData.description, 150);
        pdf.text(splitDescription, 20, yPosition);
      }
      
      pdf.save(`${formData.name.replace(/\s+/g, '_')}_details.pdf`);
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};