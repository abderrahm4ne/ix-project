import { useNavigate, Outlet, NavLink } from "react-router-dom";

export default function AdminDashboard(){
    
    const navigate = useNavigate();
    return(
        <div className="flex flex-col ">
            <div className="bg-amber-500 h-[7%] w-full py-3 flex flex-row items-center justify-center gap-10">
                <h1 onClick={() => navigate("/secret/admin/dashboard")} className="text-2xl btn">Admin dashboard</h1>
                <NavLink to="/secret/admin/dashboard/admin-contacts" className="text-2xl btn">Contacts and orders</NavLink>

            </div>

            <Outlet />
        </div>
    )
}