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

  const firstPageItems = allItems.slice(0, 22);
  const secondPageItems = allItems.slice(22);

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
        <th className='col-center align-baseline-cell'>PRIX UNITAIRE</th>
        <th className='col-center align-baseline-cell'>QUANTITE</th>
        <th className='col-center align-baseline-cell'>PRIX TOTAL</th>
      </tr>
    </thead>
  );

  if (!orderData) return <div className="p-10">No order data found.</div>;

  return (
    <div className='page-container'>
      <div ref={pdfRef} className="pdf-wrapper">
        
        {/* --- PAGE 1 --- */}
        <div className='invoice-box'>
          <div className="invoice-header">
            <h1><span className='bold-text tracking-wider'>FACTURE :</span> {"FACTURE-" + (orderData?.orderNumber?.slice(6, 9) || '000')}</h1>
            <h2 className='date-text'><span className='bold-text'>DATE : </span>{formatDate(orderData?.createdAt)}</h2>
          </div>
          
          <div className='customer-info-card'>
            <p><span className='bold-text'>CLIENT :</span> {orderData?.customer?.name}</p>
            <p><span className='bold-text'>TELEPHONE :</span> {orderData?.customer?.phone}</p>
            <p><span className='bold-text'>ADRESSE :</span> {orderData?.customer?.address}</p>
          </div>

          <div className='table-container'>
            <table className='invoice-table'>

              <TableHeader />

              <tbody>
                {firstPageItems.map((item, index) => (
                  <tr key={index}>
                    <td className='col-article align-baseline'>{item.reference}</td>
                    <td className='col-center align-baseline'>{item.price} DA</td>
                    <td className='col-center align-baseline'>{item.quantity}</td>
                    <td className='col-center font-bold-item align-baseline'>
                      {(item.price * (item.quantity || 0)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/*show Total on Page 1 if there is NO Page 2 */}
          {secondPageItems.length === 0 && (
            <>
              <div className='total-summary'>
                <div className='total-row'>
                  <span>Total:</span>
                  <span className='bold-text'>{orderData.total} DA</span>
                </div>
              </div>
              <div className='invoice-footer'>
                <div className="footer-content">Merci pour votre confiance !<br />SEGHOUANI ABDENOUR</div>
                <div className="page-number">page: 1/1</div>
              </div>
            </>
          )}
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
                      <td className='col-center align-baseline'>{item.price} DA</td>
                      <td className='col-center align-baseline'>{item.quantity || item.quantite}</td>
                      <td className='col-center font-bold-item align-baseline'>
                        {(item.price * (item.quantity || 0)).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className='total-summary'>
              <div className='total-row'>
                <span>Total:</span>
                <span className='bold-text'>{orderData.total} DA</span>
              </div>
            </div>

            <div className='invoice-footer'>
              <div className="footer-content">Merci pour votre confiance !<br />SEGHOUANI ABDENOUR</div>
              <div className="page-number">page: 2/2</div>
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