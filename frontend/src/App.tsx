import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TaskCheck from './pages/TaskCheck';
import DorManagement from './pages/DorManagement';
import DorForm from './pages/DorForm';
import DorDetail from './pages/DorDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<TaskCheck />} />
          <Route path="dors" element={<DorManagement />} />
          <Route path="dors/create" element={<DorForm />} />
          <Route path="dors/:id" element={<DorDetail />} />
          <Route path="dors/:id/edit" element={<DorForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App; 