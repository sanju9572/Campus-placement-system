import { motion, useMotionValue, useMotionTemplate, AnimatePresence } from "framer-motion";
import { FaUserGraduate, FaUserTie } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../api/axios"; // ✅ using env axios

export default function RegistrationForm() {
  const [role, setRole] = useState("student");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
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
      await API.post("/auth/register", {
        ...formData,
        role,
      });

      // 🎉 SHOW SUCCESS ANIMATION
      setShowSuccess(true);

      setTimeout(() => {
        if (role === "student") navigate("/student-profile");
        else navigate("/login");
      }, 2000);

    } catch (err) {
      alert(err.response?.data?.detail || "Registration Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-gradient-to-br from-sky-100 via-indigo-100 to-emerald-100">

      {/* SUCCESS POPUP */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0 }}
            className="fixed top-10 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 font-semibold text-lg"
          >
            Registration Successful 🎉✨
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Background */}
      <motion.div animate={{ y: [0, -40, 0] }} transition={{ repeat: Infinity, duration: 10 }}
        className="absolute w-[28rem] h-[28rem] bg-indigo-300/30 rounded-full top-10 left-10 blur-3xl" />
      <motion.div animate={{ y: [0, 50, 0] }} transition={{ repeat: Infinity, duration: 12 }}
        className="absolute w-[32rem] h-[32rem] bg-emerald-300/30 rounded-full bottom-10 right-10 blur-3xl" />

      <motion.div
        onMouseMove={handleMouseMove}
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

        {/* LEFT */}
        <div className="p-10 flex flex-col justify-center bg-gradient-to-br from-indigo-500 to-emerald-500 text-white">
          <FaUserGraduate className="text-5xl mb-6" />
          <h1 className="text-3xl font-bold">Campus Placement System</h1>
          <p className="mt-4 text-indigo-100 text-sm">Register and start your placement journey.</p>
        </div>

        {/* RIGHT */}
        <div className="relative p-10 bg-white rounded-r-[2rem]">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Create Account</h2>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <RoleButton icon={<FaUserGraduate />} label="Student" active={role === "student"} onClick={() => setRole("student")} />
            <RoleButton icon={<FaUserTie />} label="Admin" active={role === "admin"} onClick={() => setRole("admin")} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="First Name" name="first_name" type="text" onChange={handleChange} required />
            <Input label="Last Name" name="last_name" type="text" onChange={handleChange} required />
            <Input label="Email" name="email" type="email" onChange={handleChange} required />
            <Input label="Password" name="password" type="password" onChange={handleChange} required />

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-500 to-emerald-500 text-white py-3 rounded-xl font-semibold">
              {isSubmitting ? "Creating..." : `Register as ${role}`}
            </motion.button>
          </form>

          <p className="text-sm text-gray-500 mt-4 text-center">
            Already registered? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* Components */
function RoleButton({ icon, label, active, onClick }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition ${
        active ? "bg-indigo-500 text-white border-indigo-500"
        : "bg-white text-slate-600 border-gray-200 hover:border-indigo-400"
      }`}>
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

function Input({ label, type, ...props }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <motion.input whileFocus={{ scale: 1.02 }} type={type} {...props}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition" />
    </div>
  );
}
