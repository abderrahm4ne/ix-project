import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Photo from '../Swipper/Photo';

export default function HomePage() {
    const navigate = useNavigate();

  return (
    <div className="flex flex-col-reverse space-y-15 md:flex-row items-center justify-center min-h-screen px-6 bg-gradient-to-r from-[#ffffff] to-[#949494] pt-25">

      {/* Left Section */}
      <div className="flex flex-col items-center text-center md:items-start md:text-left max-w-md gap-2">

        <h1 className="text-6xl font-logo tracking-wide brand-title" 
            style={{ 
              color: '#cf5504',
              textShadow: '-5px 7px 15px rgba(0, 0, 0, 0.1), 0 0 20px rgba(255, 102, 0, 0.2)'
            }}>
          IMEX.SH
        </h1>
        <p className="text-gray-500 fonts-routes italic font-medium" 
           style={{ 
             textShadow: '-2px 2px 8px rgba(0, 0, 0, 0.2)',
             paddingTop: '10px',
             fontSize: '1.2rem'
           }}>
          "Your first stop for IMEX products in Algeria - offering premium quality, competitive prices, and reliable service."
        </p>
        <Button size="lg" 
                variant='contained' 
                style={{ 
                  backgroundColor: '#3B3B3B', 
                  textTransform: 'none', 
                  padding: '15px 25px', 
                  fontSize: '1.8rem', 
                  marginTop: '10px', 
                  width: '100%',  
                  textAlign: 'center', 
                  color: "#f5f5f5", 
                  border: "1px solid #161616"
                }} 
                className='btn hover:bg-orange-600 transition-colors' 
                onClick={() => (navigate('/products'))}>
          Order Now
        </Button>

      </div>

      {/* Right Section (Slider) */}
      <div className="mb-10 md:mt-0 md:ml-12 w-full max-w-lg">
        <Photo />
      </div>

    </div>
  );
}