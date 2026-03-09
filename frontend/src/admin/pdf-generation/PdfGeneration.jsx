import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import './PdfGeneration.css';
import Button from "@mui/material/Button";

const ITEMS_PER_FIRST_PAGE = 24;
const ITEMS_PER_PAGE = 30; // subsequent pages can fit more (no header)

export default function PdfGeneration() {
  const location = useLocation();
  const orderData = location.state?.orderData;
  const allItems = orderData?.items || [];
  const [euroFactor, setEuroFactor] = useState(false);
  const pdfRef = useRef(null);

  // --- Chunk items into pages ---
  const buildPages = () => {
    if (allItems.length === 0) return [[]];
    const pages = [];
    // First page
    pages.push(allItems.slice(0, ITEMS_PER_FIRST_PAGE));
    // Remaining pages
    let cursor = ITEMS_PER_FIRST_PAGE;
    while (cursor < allItems.length) {
      pages.push(allItems.slice(cursor, cursor + ITEMS_PER_PAGE));
      cursor += ITEMS_PER_PAGE;
    }
    return pages;
  };

  const pages = buildPages();
  const totalPages = pages.length;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  // --- PDF Generation: capture each page div separately ---
  const generatePDF = async () => {
    const element = pdfRef.current;
    if (!element) return;

    // Grab each rendered page div by data attribute
    const pageDivs = element.querySelectorAll('[data-pdf-page]');
    if (pageDivs.length === 0) return;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < pageDivs.length; i++) {
      const canvas = await html2canvas(pageDivs[i], {
        scale: 1,
        useCORS: true,
        windowWidth: 794,
      });

      const imgData = canvas.toDataURL('image/png');

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }

    pdf.save(`invoice_${orderData?.orderNumber || 'unknown'}.pdf`);
  };

  const TableHeader = () => (
    <thead>
      <tr>
        <th className='col-article align-baseline-cell'>ARTICLE</th>
        <th className='col-center align-baseline-cell'>QUANTITE</th>
        {!euroFactor && <th className='col-center align-baseline-cell'>PRIX UNITAIRE</th>}
      </tr>
    </thead>
  );

  if (!orderData) return <div className="p-10">No order data found.</div>;

  return (
    <div className='page-container'>
      <Button onClick={() => setEuroFactor(!euroFactor)}>Change Factor</Button>

      <div ref={pdfRef} className="pdf-wrapper">

        {pages.map((pageItems, pageIndex) => {
          const isFirstPage = pageIndex === 0;
          const isLastPage = pageIndex === totalPages - 1;

          return (
            <div
              key={pageIndex}
              className='invoice-box'
              data-pdf-page={pageIndex}
              style={{ marginTop: pageIndex > 0 ? '0' : undefined }}
            >
              {/* Header: only on first page */}
              {isFirstPage && !euroFactor && (
                <div className="invoice-header">
                  <h1>
                    <span className='bold-text tracking-wider'>FACTURE :</span>{' '}
                    {'FACTURE-' + (orderData?.orderNumber?.slice(6, 9) || '000')}
                  </h1>
                  <h2 className='date-text'>
                    <span className='bold-text'>DATE : </span>
                    {formatDate(orderData?.createdAt)}
                  </h2>
                </div>
              )}

              {/* Table */}
              <div
                className='table-container'
                style={!isFirstPage ? { paddingTop: '40px' } : undefined}
              >
                <table className='invoice-table'>
                  {/* Show header on every page for readability */}
                  <TableHeader />
                  <tbody>
                    {pageItems.map((item, index) => (
                      <tr key={index}>
                        <td className='col-article align-baseline'>
                          {item.name || item.reference}
                        </td>
                        <td className='col-center align-baseline'>
                          {item.quantity ?? item.quantite}
                        </td>
                        {!euroFactor && (
                          <td className='col-center align-baseline'>{item.price}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer + Total: only on last page */}
              {isLastPage && (
                <>
                  <div className='total-summary'>
                    <div className='total-row'>
                      <span>Total:</span>
                      <span className='bold-text'>{orderData.total} DA</span>
                    </div>
                  </div>
                  <div className='invoice-footer'>
                    <div className="footer-content">
                      Merci pour votre confiance !<br />SEGHOUANI ABDENOUR
                    </div>
                    <div className="page-number">
                      page: {totalPages}/{totalPages}
                    </div>
                  </div>
                </>
              )}

              {/* Page number on non-last pages */}
              {!isLastPage && (
                <div className='invoice-footer'>
                  <div className="page-number">
                    page: {pageIndex + 1}/{totalPages}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className='button-container'>
        <button className='generate-btn' onClick={generatePDF}>GENERATE PDF</button>
      </div>
    </div>
  );
}