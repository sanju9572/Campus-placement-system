import { motion } from "framer-motion";
import { useState } from "react";

export default function StudentDashboard() {
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [showATS, setShowATS] = useState(false);

  const handleResumeUpload = (e) => {
    if (e.target.files[0]) {
      setResumeUploaded(true);
      setShowATS(false);
    }
  };

  const handleATSCheck = () => {
    if (resumeUploaded) {
      setShowATS(true);
    } else {
      alert("Please upload resume first");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-sky-50 via-indigo-100 to-emerald-100">

      {/* Heading */}
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">
        Placement Tracking Dashboard
      </h1>

      {/* TOP STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <Card title="Companies" value="24" />
        <Card title="Applied Jobs" value="6" />
        <Card title="Interviews" value="2" />
        <Card title="Active Processes" value="3" />
      </div>

      {/* APPLICATION TRACKING */}
      <SectionTitle text="Application Tracking" />
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-md mb-10 space-y-4">
        <TrackingRow company="TCS" role="Software Developer" stage="Technical Round" />
        <TrackingRow company="Infosys" role="System Analyst" stage="Assessment Completed" />
      </div>

      {/* UPCOMING INTERVIEWS */}
      <SectionTitle text="Upcoming Interviews" />
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <InterviewCard company="TCS" round="Technical Round" date="15 Feb 2026" time="10:00 AM" />
        <InterviewCard company="Wipro" round="HR Round" date="18 Feb 2026" time="2:00 PM" />
      </div>

      {/* ATS SCORE */}
      <SectionTitle text="Resume ATS Score" />
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-md">
        <input
          type="file"
          onChange={handleResumeUpload}
          className="mb-4 block"
        />

        <button
          onClick={handleATSCheck}
          className="bg-gradient-to-r from-indigo-500 to-emerald-500 text-white px-5 py-2 rounded-lg font-semibold"
        >
          Match Resume with Job Description
        </button>

        {showATS && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200"
          >
            <p className="text-lg font-semibold text-indigo-700">ATS Score: 78%</p>
            <p>Matched Skills: Java, SQL</p>
            <p>Missing Skills: React, Docker</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ---------- Components ---------- */

function Card({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-md text-center"
    >
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-indigo-700">{value}</p>
    </motion.div>
  );
}

function SectionTitle({ text }) {
  return (
    <h2 className="text-xl font-semibold text-indigo-700 mb-4 mt-4">
      {text}
    </h2>
  );
}

function TrackingRow({ company, role, stage }) {
  return (
    <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-sm">
      <p className="font-medium">{company}</p>
      <p className="text-gray-600">{role}</p>
      <p className="text-indigo-600 font-semibold">{stage}</p>
    </div>
  );
}

function InterviewCard({ company, round, date, time }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white/70 backdrop-blur-xl rounded-xl p-5 shadow-md"
    >
      <h3 className="font-bold text-indigo-700">{company}</h3>
      <p className="text-sm text-gray-600 mt-1">{round}</p>
      <p className="text-sm mt-2">📅 {date}</p>
      <p className="text-sm">⏰ {time}</p>
    </motion.div>
  );
}
