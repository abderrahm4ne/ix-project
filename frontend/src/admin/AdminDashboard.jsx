import { useNavigate, Outlet, NavLink } from "react-router-dom";

export default function AdminDashboard(){
    
    const navigate = useNavigate();
    return(
        <div className="flex flex-col ">
            <div className="flex flex-row bg-orange-700 justify-center items-center py-4 gap-4 md:gap-5 lg:gap-8">
                <h1 onClick={() => navigate("/secret/admin/dashboard")} className="btn lg:text-3xl md:text-2xl text-xl text-center">Admin dashboard</h1>
                <NavLink to="/secret/admin/dashboard/admin-contacts" className="btn lg:text-3xl md:text-2xl text-xl text-center">Contacts and orders</NavLink>

            </div>

            <Outlet />
        </div>
    )
}