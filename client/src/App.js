import './App.css';
import { Routes, Route } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponent';
import Student from './pages/Student';
import Subject from './pages/Subject';

function App() {
  return (
    <>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<Student />} />
        <Route path="/subjects" element={<Subject />} />
      </Routes>
    </>
  );
}

export default App;
