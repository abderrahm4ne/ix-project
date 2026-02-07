
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import './PdfGeneration.css'

export default function PdfGeneration() {
  const location = useLocation();
  const orderData = location.state?.orderData;
  const items = orderData?.items || [];

  const pdfRef = useRef(null);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
    
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  pdf.save(`invoice_${orderData?.orderNumber || 'unknown'}.pdf`);
};

  if (!orderData) return <div className="p-10">No order data found.</div>;

  return (
<div className='page-container'>
      
      <div ref={pdfRef} className='invoice-box'>
        
        {/* HEADER SECTION */}
        <div className="invoice-header">
          <h1><span className='bold-text tracking-wider'>FACTURE :</span> {orderData?.orderNumber}</h1>
          <h2 className='date-text'><span className='bold-text'>DATE : </span>{formatDate(orderData?.createdAt)}</h2>
        </div>
        
        {/* CUSTOMER INFO */}
        <div className='customer-info-card'>
          <p><span className='bold-text'>CLIENT :</span> {orderData?.customer?.name}</p>
          <p><span className='bold-text'>TELEPHONE :</span> {orderData?.customer?.phone}</p>
          <p><span className='bold-text'>EMAIL :</span> {orderData?.customer?.email}</p>
          <p><span className='bold-text'>ADRESSE :</span> {orderData?.customer?.address}</p>
        </div>

        {/* TABLE SECTION */}
        <div className='table-container'>
          <table className='invoice-table'>
            <thead>
              <tr>
                <th className='col-article'>ARTICLE</th>
                <th className='col-center'>PRIX UNITAIRE</th>
                <th className='col-center'>QUANTITE</th>
                <th className='col-center'>PRIX TOTAL</th>
              </tr>
            </thead>
            <tbody>            
              {items.map((item, index) => (
                <tr key={index}>
                  <td className='col-article'>{item.reference}</td>
                  <td className='col-center'>{ item.price }€</td>
                  <td className='col-center'>{item.quantity || item.quantite}</td>
                  <td className='col-center font-bold-item'>
                    { (item.price * (item.quantity || 0)).toFixed(2) } €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTAL SUMMARY */}
        <div className='total-summary'>
          <div className='total-row'>
            <span>Total:</span>
            <span className='bold-text'>{orderData.total}€</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className='invoice-footer'>
          <div className="footer-content">
            Merci pour votre confiance !<br />
            SEGHOUANI ABDENOUR
          </div>
          <div className="page-number">page: 1</div>
        </div>
        
      </div>

      <div className='button-container'>
        <button className='generate-btn' onClick={generatePDF}>
          GENERATE PDF
        </button>
      </div>
    </div>
  );
}
