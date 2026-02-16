import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import './PdfGeneration.css';
import Button from "@mui/material/Button";

export default function PdfGeneration() {
  const location = useLocation();
  const orderData = location.state?.orderData;
  const allItems = orderData?.items || [];
  const [ euroFactor, setEuroFactor ] = useState(false);
  const pdfRef = useRef(null);

  const firstPageItems = allItems.slice(0, 28);
  const secondPageItems = allItems.slice(28);
// aedasdasd
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const changeFactor = () => {
    setEuroFactor(!euroFactor)
  }

  const generatePDF = async () => {
    const element = pdfRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 1,
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

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight * (secondPageItems.length > 0 ? 2 : 1));

    if (secondPageItems.length > 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -pdfHeight, pdfWidth, pdfHeight * 2);
    }

    pdf.save(`invoice_${orderData?.orderNumber || 'unknown'}.pdf`);
  };

  const TableHeader = () => (
    <thead>
      <tr>
        <th className='col-article align-baseline-cell'>ARTICLE</th>
        <th className='col-center align-baseline-cell'>QUANTITE</th>
        {!euroFactor && <td className='col-center align-baseline'>PRIX UNITAIRE</td>}
      </tr>
    </thead>
  );

  if (!orderData) return <div className="p-10">No order data found.</div>;

  return (
    <div className='page-container'>
      
      <Button onClick={() => { changeFactor() }}> Change Factor</Button>
      <div ref={pdfRef} className="pdf-wrapper">
        
        {/* --- PAGE 1 --- */}
        <div className='invoice-box'>

         {!euroFactor && 
         <div className="invoice-header">
            <h1><span className='bold-text tracking-wider'>FACTURE :</span> {"FACTURE-" + (orderData?.orderNumber?.slice(6, 9) || '000')}</h1>
            <h2 className='date-text'><span className='bold-text'>DATE : </span>{formatDate(orderData?.createdAt)}</h2>
          </div>} 
          
          {!euroFactor && 
          <div className='customer-info-card'>
            <p><span className='bold-text'>CLIENT :</span> {orderData?.customer?.name}</p>
            <p><span className='bold-text'>TELEPHONE :</span> {orderData?.customer?.phone}</p>
            <p><span className='bold-text'>ADRESSE :</span> {orderData?.customer?.address}</p>
          </div>}
          

          <div className='table-container'>
            <table className='invoice-table'>

              <TableHeader />

              <tbody>
                {firstPageItems.map((item, index) => (
                  <tr key={index}>
                    <td className='col-article align-baseline'>{item.name}</td>
                    <td className='col-center align-baseline'>{item.quantity}</td>
                    {!euroFactor && <td className='col-center align-baseline'>{item.price}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- PAGE 2 (Conditional) --- */}
        {secondPageItems.length > 0 && (
          <div className='invoice-box' style={{ marginTop: '0' }}>
            <div className='table-container' style={{ paddingTop: '40px' }}>
              <table className='invoice-table'>
                <tbody>
                  {secondPageItems.map((item, index) => (
                    <tr key={index}>
                      <td className='col-article align-baseline'>{item.reference}</td>
                      <td className='col-center align-baseline'>{item.quantity || item.quantite}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className='button-container'>
        <button className='generate-btn' onClick={generatePDF}>GENERATE PDF</button>
      </div>
    </div>
  );
}