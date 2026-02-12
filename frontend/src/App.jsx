import { Routes, Route } from "react-router-dom";
import Welcome from "./components/Welcome";
import RegistrationForm from "./components/RegistrationForm";
import Login from "./components/Login";
import StudentProfileForm from "./components/StudentProfileForm";
import StudentDashboard from "./components/DashboardUI";



  

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/register" element={<RegistrationForm />} />
      <Route path="/login" element={<Login />} />
      <Route path="/student-profile" element={<StudentProfileForm />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />


    </Routes>
  );
}

export default App;
