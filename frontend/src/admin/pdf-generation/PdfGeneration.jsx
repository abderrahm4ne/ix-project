import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import { useRef } from 'react';
import html2canvas from 'html2canvas';

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
    if(!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    })
    pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight())
    pdf.save(`invoice_${orderData?.orderNumber || 'unkown'}.pdf`)
  }

  if (!orderData) return <div className="p-10">No order data found.</div>;

  return (
    <div className='flex flex-col items-center py-10 bg-gray-200 print:py-0'>
      
      <div ref={pdfRef} className='bg-white w-[794px] min-h-[1123px] px-10 pb-3 pt-7 flex flex-col '>
        
        {/* HEADER SECTION */}
        <div className="mb-6">
          <h1 className='text-xl mb-1'><span className='font-bold tracking-wider'>FACTURE :</span> {orderData?.orderNumber}</h1>
          <h1 className='text-[1.1rem]'><span className='font-bold'>DATE : </span>{formatDate(orderData?.createdAt)}</h1>
        </div>
        
        {/* CUSTOMER INFO */}
        <div className='border px-4 py-3 rounded-xl flex flex-col w-full mb-8 bg-[#f3f4f6]'>
          <h1 className='py-0.5'><span className='font-semibold'>CLIENT :</span> {orderData?.customer?.name}</h1>
          <h1 className='py-0.5'><span className='font-semibold'>TELEPHONE :</span> {orderData?.customer?.phone}</h1>
          <h1 className='py-0.5'><span className='font-semibold'>EMAIL :</span> {orderData?.customer?.email}</h1>
          <h1 className='py-0.5'><span className='font-semibold'>ADRESSE :</span> {orderData?.customer?.address}</h1>
        </div>

        {/* TABLE SECTION */}
        <div className='w-full'>
          <table className='w-full border-collapse border border-black border-solid'>
            <thead className='text-sm bg-[#f3f4f6] uppercase'>
              <tr className='h-8'>
                <th className='border border-black pl-5 text-left w-[50%] align-baseline tracking-wider'>ARTICLE</th>
                <th className='border border-black text-center px-1 align-baseline'>PRIX UNITAIRE</th>
                <th className='border border-black text-center px-1 align-baseline'>QUANTITE</th>
                <th className='border border-black text-center px-1 align-baseline'>PRIX TOTAL</th>
              </tr>
            </thead>
            <tbody>            
              {items.map((item, index) => (
                <tr key={index} className="h-8"> {/* Fixed height helps vertical alignment show better */}
                  <td className='border border-black pl-5 text-left align-baseline'>{item.reference}</td>
                  <td className='border border-black px-2 align-baseline'>
                    { item.price }€
                  </td>
                  <td className='border border-black px-2 align-baseline'>{item.quantity || item.quantite}</td>
                  <td className='border border-black px-2 align-baseline font-semibold'>
                    { (item.price * (item.quantity)).toFixed(2) } €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTAL SUMMARY */}
        <div className='mt-4 self-end w-1/3'>
          <div className='flex justify-between border-b border-black py-1'>
            <span>Total:</span>
            <span className='font-bold'>{orderData.total}€</span>
          </div>
        </div>

        {/* 3. FOOTER */}
        <div className='mt-auto text-center pt-10 text-sm'>
          <div className="border-t pt-4">
            Merci pour votre confiance !<br />
            SEGHOUANI ABDENOUR
          </div>
          <div className="mt-2">page: 1</div>
        </div>
        
      </div>

      <div className='pt-5 '>
        <button className='text-2xl bg-[#1e40af] px-5 py-2 rounded-md text-white hover:cursor-pointer hover:scale-102 transition-transform duration-300' onClick={() => {
          generatePDF()
        }}>GENERATE PDF</button>
      </div>
    </div>
    
  );
}