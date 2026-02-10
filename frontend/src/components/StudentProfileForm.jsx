import { motion } from "framer-motion";
import { FaUserGraduate, FaChalkboardTeacher, FaFileUpload, FaLink } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios"; // your axios instance

export default function StudentProfileForm() {
  const [currentSection, setCurrentSection] = useState(0);
  const [progress, setProgress] = useState(25);
  const [resumeFile, setResumeFile] = useState(null);
  const navigate = useNavigate();

  // 🧠 Form State
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    roll_no: "",
    department_id: "",
    graduation_year: "",
    cgpa: "",
    active_backlogs: "",
    total_backlogs: "",
    tenth_percentage: "",
    twelfth_percentage: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: ""
  });

  const sections = [
    { title: "Basic Info", icon: FaUserGraduate },
    { title: "Academic", icon: FaChalkboardTeacher },
    { title: "Backlogs", icon: FaFileUpload },
    { title: "Resume & Links", icon: FaLink }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextSection = () => {
    if (currentSection < 3) {
      setCurrentSection(prev => prev + 1);
      setProgress(prev => prev + 25);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
      setProgress(prev => prev - 25);
    }
  };

  // 🚨 Validation
  const validateForm = () => {
    for (let key in formData) {
      if (!formData[key]) {
        alert("Please fill all fields before submitting!");
        return false;
      }
    }
    if (!resumeFile) {
      alert("Please upload your resume!");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");

      const payload = {
        ...formData,
        graduation_year: Number(formData.graduation_year),
        cgpa: Number(formData.cgpa),
        active_backlogs: Number(formData.active_backlogs),
        total_backlogs: Number(formData.total_backlogs),
        tenth_percentage: Number(formData.tenth_percentage),
        twelfth_percentage: Number(formData.twelfth_percentage),
        resume_url: resumeFile.name, // or upload logic
        placement_status: "placed",
        is_profile_complete: true
      };

      await axios.post(
        "/student/profile",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Profile Completed Successfully 🎉");
      navigate("/student-dashboard");

    } catch (err) {
      alert("Error submitting profile ❌");
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-gradient-to-br from-sky-50 via-indigo-100 to-emerald-100">

      <motion.div animate={{ y: [0, -40, 0] }} transition={{ repeat: Infinity, duration: 10 }} className="absolute w-[28rem] h-[28rem] bg-indigo-300/30 rounded-full top-10 left-10 blur-3xl"/>
      <motion.div animate={{ y: [0, 50, 0] }} transition={{ repeat: Infinity, duration: 12 }} className="absolute w-[32rem] h-[32rem] bg-emerald-300/30 rounded-full bottom-10 right-10 blur-3xl"/>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative z-10 max-w-3xl w-full rounded-[2rem] bg-white/60 backdrop-blur-2xl border border-white/40 shadow-[0_30px_80px_rgba(0,0,0,0.15)] overflow-hidden">

        <div className="bg-gradient-to-r from-indigo-600 to-emerald-500 p-8 text-white">
          <div className="flex items-center gap-4">
            <FaUserGraduate className="text-4xl" />
            <div>
              <h1 className="text-2xl font-bold">Complete Student Profile</h1>
              <p className="text-indigo-100 text-sm">Step {currentSection + 1} of 4</p>
            </div>
          </div>
          <div className="mt-6 w-full bg-white/40 rounded-full h-3">
            <motion.div animate={{ width: `${progress}%` }} className="bg-white h-3 rounded-full"/>
          </div>
        </div>

        <div className="p-3 bg-white/40 backdrop-blur-md">
          <div className="flex gap-2">
            {sections.map((section, index) => (
              <button key={index} onClick={() => setCurrentSection(index)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                  index === currentSection
                    ? "bg-gradient-to-r from-indigo-500 to-emerald-500 text-white"
                    : "bg-white text-slate-600 border border-gray-200"
                }`}>
                <section.icon className="mx-auto mb-1" />
                {section.title}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8 space-y-4">

          {currentSection === 0 && (
            <>
              <Input label="First Name *" name="first_name" onChange={handleChange}/>
              <Input label="Last Name *" name="last_name" onChange={handleChange}/>
              <Input label="Roll Number *" name="roll_no" onChange={handleChange}/>
              <Input label="Department ID *" name="department_id" onChange={handleChange}/>
              <Input label="Graduation Year *" name="graduation_year" type="number" onChange={handleChange}/>
            </>
          )}

          {currentSection === 1 && (
            <>
              <Input label="CGPA *" name="cgpa" type="number" onChange={handleChange}/>
              <Input label="10th Percentage *" name="tenth_percentage" type="number" onChange={handleChange}/>
              <Input label="12th Percentage *" name="twelfth_percentage" type="number" onChange={handleChange}/>
            </>
          )}

          {currentSection === 2 && (
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Active Backlogs *" name="active_backlogs" type="number" onChange={handleChange}/>
              <Input label="Total Backlogs *" name="total_backlogs" type="number" onChange={handleChange}/>
            </div>
          )}

          {currentSection === 3 && (
            <>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Upload Resume *</label>
                <input type="file" accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2" />
              </div>

              <Input label="LinkedIn URL *" name="linkedin_url" type="url" onChange={handleChange}/>
              <Input label="GitHub URL *" name="github_url" type="url" onChange={handleChange}/>
              <Input label="Portfolio URL *" name="portfolio_url" type="url" onChange={handleChange}/>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button onClick={prevSection} disabled={currentSection === 0}
              className="flex-1 py-3 border border-gray-300 rounded-xl disabled:opacity-50">
              Previous
            </button>

            <button
              onClick={currentSection === 3 ? handleSubmit : nextSection}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-emerald-500 text-white py-3 rounded-xl font-semibold">
              {currentSection === 3 ? "Submit Profile" : "Next"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Input({ label, name, type = "text", onChange }) {
  return (
    <div>
      <label className="block text-sm text-gray-600 mb-1">{label}</label>
      <input name={name} type={type} onChange={onChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"/>
    </div>
  );
}
