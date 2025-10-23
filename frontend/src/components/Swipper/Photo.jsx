import { useState, useEffect, useRef } from "react";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import img1 from '../../assets/img1.jpeg'
import img2 from '../../assets/img2.jpeg'
import img3 from '../../assets/img3.jpeg'

const images = [
  img1,
  img2,
  img3
];

export default function Photo() {

  const [current, setCurrent] = useState(0);

  const mainImgRef = useRef(null);
  const leftImgRef = useRef(null);
  const rightImgRef = useRef(null);

  const nextImage = () => {
      setCurrent((prev) => (prev + 1) % images.length); // change AFTER animation
  };

  const prevImage = () => {
      setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 6000);
    return () => clearInterval(interval);
  }, [current]);


  return (
    <div className="relative flex items-center justify-center ">

      <img
        ref={rightImgRef}
        src={images[(current + 1) % images.length]}
        alt="Behind Right"
        className="absolute xl:w-[420px] xl:h-[740px] md:w-[300px] md:h-[500px] w-[330px] h-[550px] ml-8 rounded-xl shadow-md opacity-70 sm:mb-20 "
        style={{ rotate: "3deg", boxShadow: "6px -3px 10px #333333" }}
      />

      <img
        ref={leftImgRef}
        src={images[(current + 2) % images.length]}
        alt="Behind Left"
        className="absolute xl:w-[420px] xl:h-[740px] md:w-[300px] md:h-[500px] w-[330px] h-[550px] mr-8 rounded-xl shadow-md opacity-70 sm:mb-20"
        style={{ rotate: "-3deg", boxShadow: "-6px -3px 10px #333333" }}
      />

      <img
        key={current}
        ref={mainImgRef}
        src={images[current]}
        alt="Main"
        className="relative xl:w-[420px] xl:h-[740px] md:w-[300px] md:h-[500px] w-[330px] h-[550px] rounded-xl shadow-lg sm:mb-20"
        style={{ boxShadow: "0px 2px 10px #333333" }}
      />


      <div className="absolute bottom-7 flex space-x-4">

        <NavigateBeforeIcon onClick={prevImage} className="creamy hover:cursor-pointer btn" style={{fontSize:"2rem"}}/>

        <NavigateNextIcon onClick={nextImage} className="creamy hover:cursor-pointer btn" style={{fontSize:"2rem"}}/>

      </div>
    </div>
  );
}
