import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import gsap from 'gsap';
import { useRef, useEffect } from "react";


export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);



  useEffect(() => {
    if (!menuRef.current) return;

    gsap.to(menuRef.current, {
      y: menuOpen ? 0 : -20,
      opacity: menuOpen ? 1 : 0,
      pointerEvents: menuOpen ? "auto" : "none",
      duration: 0.25,
      ease: "power2.out",
    });
  }, [menuOpen]);

  return (
    <div className="flex flex-col">

      <div className="w-full bg-[#dbdbdb] flex flex-row items-center py-3 xl:px-20 md:px-7 px-5 justify-between border-b border-[#3B3B3B]">

        {/* Left - Logo */} 
        <div className="flex-1 flex justify-start tracking-wider">
          <div className="xl:text-5xl text-5xl font-logo brand-title"
          style={{ textShadow: '-3px 3px 6px rgba(0, 0, 0, 0.2)' }}>
            IMEX.<span className="text-[1.3rem] tracking-tighter">SEGHOUANI</span>
          </div>
        </div>

        {/* Center - Navigation Links */}
        <div className="flex-1 flex justify-center">
          <div className="hidden sm:flex md:space-x-3.5 space-x-2">
            <NavLink to="" className="routes font-routes brand-title xl:text-[1.2rem] sm:text-[1.1rem] text-[1rem] font-bold">HOME</NavLink>
            <NavLink to="products" className="routes font-routes brand-title xl:text-[1.2rem] sm:text-[1.1rem] text-[1rem] font-bold">PRODUCTS</NavLink>
            <NavLink to="contact" className="routes font-routes brand-title xl:text-[1.2rem] sm:text-[1.1rem] text-[1rem] font-bold">CONTACT</NavLink>
          </div>
        </div>

        {/* Right - Icons */}
        <div className="flex-1 flex justify-end items-center space-x-3">
          

          <NavLink to="CompleteYourOrder"> 
            <ShoppingCartIcon style={{ fontSize: '2.1rem' }} className=" brand-title cursor-pointer routes"/>
          </NavLink>
          
          <button className="sm:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <CloseIcon style={{ fontSize: '2.1rem' }} className=" brand-title cursor-pointer routes" />
            ) : (
              <MenuIcon style={{ fontSize: '2.1rem' }} className=" brand-title cursor-pointer routes" />
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col relative z-10">
        <div
            ref={menuRef}
            className="sm:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-[#ffffff] to-[#949494] border-b flex flex-col z-50"
        >
                <NavLink to="" className="font-bold sm:hidden p-2 ham-menu text-center font-routes brand-title text-[1rem] py-3 border-b w-full" style={{ minHeight: '52px' }} onClick={() => setMenuOpen(false)}>HOME</NavLink>
                <NavLink to="products" className="font-bold sm:hidden p-2 ham-menu text-center font-routes brand-title text-[1rem] py-3 border-b w-full" style={{ minHeight: '52px' }} onClick={() => setMenuOpen(false)}>PRODUCTS</NavLink>
                <NavLink to="contact" className="font-bold sm:hidden p-2 ham-menu text-center font-routes brand-title text-[1rem] py-3 w-full" style={{ minHeight: '52px' }} onClick={() => setMenuOpen(false)}>CONTACT</NavLink> 
        </div>
      </div>
      {/* Mobile Menu */}
      

      
  
      <Outlet />

      <div className="w-full border-1 border-black bg-[#dbdbdb] brand-title text-center py-5.5 text-xl font-routes flex flex-col items-center justify-center">
        &copy; {new Date().getFullYear()} IMEX ~ ALGERIA
        <h3 className="text-lg"></h3> 
        <h3 className="text-lg"></h3>
      </div>
    </div>
  );
}