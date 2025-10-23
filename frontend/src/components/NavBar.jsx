import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchClick = () => {
    if (searchOpen && searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    } else {
      setSearchOpen(!searchOpen);
    }
  };

  return (
    <div className="flex flex-col">

      <div className="w-full bg-[#dbdbdb] flex flex-row items-center py-3 xl:px-20 md:px-7 px-5 justify-between border-b border-[#3B3B3B]">

        {/* Left - Logo */} 
        <div className="flex-1 flex justify-start tracking-wider">
          <div className="xl:text-6xl text-5xl font-logo brand-title"
          style={{ textShadow: '-3px 3px 6px rgba(0, 0, 0, 0.2)' }}>
            IMEX.SH
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
          {/* Search Field */}
          {searchOpen && (
            <div className="mr-4 transition-all duration-300 ease-in-out">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                autoFocus
                className="px-4 py-2 text-xl rounded-full bg-transparent border border-[#3B3B3B] text-[#3B3B3B] placeholder-[#3B3B3B] font-bold focus:outline-none focus:ring-2 focus:ring-[#ffffff] w-48 md:w-64 transition-all duration-300"
              />
            </div>
          )}

          <NavLink to="CompleteYourOrder"> 
            <ShoppingCartIcon style={{ fontSize: '2.1rem' }} className=" brand-title cursor-pointer routes"/>
          </NavLink>
          
          <SearchIcon 
            style={{ fontSize: '2.1rem' }} 
            onClick={handleSearchClick}
            className="brand-title cursor-pointer routes" 
          />

          <button className="sm:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <CloseIcon style={{ fontSize: '2.1rem' }} className=" brand-title cursor-pointer routes" />
            ) : (
              <MenuIcon style={{ fontSize: '2.1rem' }} className=" brand-title cursor-pointer routes" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden bg-gradient-to-b from-[#ffffff] to-[#949494] border-b flex flex-col">
          {/* Mobile Search Field */}
          <div className="px-4 py-3 border-b">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                  setMenuOpen(false);
                  setSearchQuery("");
                }
              }}
              className="w-full px-4 py-2 rounded-full text-xl bg-transparent border border-[#3B3B3B] text-[#f8f3e9] brand-title placeholder-[#3B3B3B] focus:outline-none focus:ring-2 focus:ring-[#ffffff]"
            />
          </div>
          
          <NavLink to="" className="font-bold ham-menu text-center font-routes brand-title text-[1rem] py-3 border-b w-full" onClick={() => setMenuOpen(false)}>HOME</NavLink>
          <NavLink to="products" className="font-bold ham-menu text-center font-routes brand-title text-[1rem] py-3 border-b w-full" onClick={() => setMenuOpen(false)}>PRODUCTS</NavLink>
          <NavLink to="contact" className="font-bold ham-menu text-center font-routes brand-title text-[1rem] py-3 w-full" onClick={() => setMenuOpen(false)}>CONTACT</NavLink>
        </div>
      )}

      <Outlet />

      <div className="w-full bg-[#dbdbdb] brand-title text-center py-5.5 text-xl font-routes flex flex-col items-center justify-center">
        &copy; {new Date().getFullYear()} IMEX ~ ALGEIRA
        <h3 className="text-lg"></h3>
        <h3 className="text-lg"></h3>
      </div>
    </div>
  );
}