import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { FaUserGraduate, FaUserTie } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function LoginForm() {
  const [role, setRole] = useState("student");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post(
        "https://placement-hub-1-xfy2.onrender.com/auth/login",
        formData
      );

      console.log(res.data);

      // Store token if backend returns one
      if (res.data.access_token) {
        localStorage.setItem("token", res.data.access_token);
      }

      setSuccess(true); // 🎉 show animation

      setTimeout(() => {
        navigate("/student-dashboard"); // 🚀 go to dashboard
      }, 1800);

    } catch (err) {
      alert("Invalid email or password ❌");
      console.error(err.response?.data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-gradient-to-br from-sky-100 via-indigo-100 to-emerald-100">

      {/* Floating Blobs */}
      <motion.div animate={{ y: [0, -40, 0] }} transition={{ repeat: Infinity, duration: 10 }}
        className="absolute w-[28rem] h-[28rem] bg-indigo-300/30 rounded-full top-10 left-10 blur-3xl" />
      <motion.div animate={{ y: [0, 50, 0] }} transition={{ repeat: Infinity, duration: 12 }}
        className="absolute w-[32rem] h-[32rem] bg-emerald-300/30 rounded-full bottom-10 right-10 blur-3xl" />

      {/* SUCCESS OVERLAY */}
      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            className="bg-white p-10 rounded-2xl text-center shadow-xl"
          >
            <h2 className="text-3xl font-bold text-indigo-600 mb-2">Login Successful 🎉</h2>
            <p className="text-gray-600">Redirecting to dashboard...</p>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 max-w-5xl w-full grid md:grid-cols-2 rounded-[2rem] bg-white/60 backdrop-blur-2xl border border-white/40 shadow-[0_30px_80px_rgba(0,0,0,0.15)] overflow-hidden"
      >
        {/* Mouse Glow */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: useMotionTemplate`
              radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(99,102,241,0.25), transparent 60%)
            `,
          }}
        />

        {/* LEFT PANEL */}
        <motion.div className="p-10 flex flex-col justify-center bg-gradient-to-br from-indigo-500 to-emerald-500 text-white">
          <FaUserGraduate className="text-5xl mb-6" />
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="mt-4 text-indigo-100 text-sm">
            Login to access your placement dashboard.
          </p>
        </motion.div>

        {/* RIGHT PANEL */}
        <motion.div className="relative p-10 bg-white rounded-r-[2rem]">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Login</h2>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <RoleButton icon={<FaUserGraduate />} label="Student" active={role==="student"} onClick={()=>setRole("student")} />
            <RoleButton icon={<FaUserTie />} label="Admin" active={role==="admin"} onClick={()=>setRole("admin")} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" name="email" type="email" onChange={handleChange} required />
            <Input label="Password" name="password" type="password" onChange={handleChange} required />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-500 to-emerald-500 text-white py-3 rounded-xl font-semibold"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </motion.button>
          </form>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-600 font-medium hover:underline">
              Register
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

function RoleButton({ icon, label, active, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex flex-col items-center gap-1 p-3 rounded-xl border ${
        active ? "bg-indigo-500 text-white border-indigo-500" : "bg-white text-slate-600 border-gray-200"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <motion.input whileFocus={{ scale: 1.02 }} {...props}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
      />
    </div>
  );
}
