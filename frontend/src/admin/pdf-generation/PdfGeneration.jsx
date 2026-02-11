import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import './PdfGeneration.css';

export default function PdfGeneration() {
  const location = useLocation();
  const orderData = location.state?.orderData;
  const allItems = orderData?.items || [];
  

  const pdfRef = useRef(null);
/*
  const firstPageItems = allItems.slice(0, 22);
  const secondPageItems = allItems.slice(22);
*/
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const generatePDF = async () => {
    const element = pdfRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      windowWidth: 794,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight );

    pdf.save(`invoice_${orderData?.orderNumber || 'unknown'}.pdf`);
  };

  const TableHeader = () => (
    <thead>
      <tr>
        <th className='col-article align-baseline-cell'>ARTICLE</th>
        <th className='col-center align-baseline-cell'>QUANTITE</th>
      </tr>
    </thead>
  );

  if (!orderData) return <div className="p-10">No order data found.</div>;

  return (
    <div className='page-container'>
      <div ref={pdfRef} className="pdf-wrapper">
        
        {/* --- PAGE 1 --- */}
        <div className='invoice-box'>
          <div className='table-container'>
            <table className='invoice-table'>

              <TableHeader />

              <tbody>
                {allItems.map((item, index) => (
                  <tr key={index}>
                    <td className='col-article align-baseline'>{item.reference}</td>
                    <td className='col-center align-baseline'>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


        </div>

      </div>

      <div className='button-container'>
        <button className='generate-btn' onClick={generatePDF}>GENERATE PDF</button>
      </div>
    </div>
  );
}