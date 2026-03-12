import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("email");
  const [formData, setFormData] = useState({ email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [errorKey, setErrorKey] = useState(0);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload =
      mode === "email"
        ? { email: formData.email, password: formData.password }
        : { phone: formData.phone, password: formData.password };

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/admin/login`,
        payload,
        { withCredentials: true }
      );
      navigate("/secret/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials.");
      setErrorKey((k) => k + 1);
    }
  };

  const inputClass =
    "w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-100 placeholder-neutral-600 text-sm outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-600/20 transition-all duration-200";

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-red-900/30 border border-red-800/50 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-neutral-100 tracking-tight">Admin Access</h1>
          <p className="text-neutral-500 text-xs mt-1">Restricted area — authorized only</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-neutral-950 border border-neutral-800 rounded-xl p-1 mb-6">
          {["email", "phone"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => { setMode(tab); setError(""); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 capitalize
                ${mode === tab
                  ? "bg-red-800 text-neutral-100 shadow-lg shadow-red-900/40"
                  : "text-neutral-500 hover:text-neutral-300"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "email" ? (
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="admin@example.com"
                required
                className={inputClass}
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 234 567 8900"
                required
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
              className={inputClass}
            />
          </div>

          {/* Error */}
          <div className="h-6 flex items-center">
            {error && (
              <p
                key={errorKey}
                className="text-red-400 text-xs flex items-center gap-2 animate-[popIn_0.3s_ease-out_forwards]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-red-800 hover:bg-red-700 active:scale-95 text-neutral-100 font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-red-900/30 text-sm tracking-wide"
          >
            Login
          </button>
        </form>
      </div>

    </div>
  );
}