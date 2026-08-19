import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SajuDashboard from './pages/SajuDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SajuDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;