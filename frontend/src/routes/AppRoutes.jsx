import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Groups from '../pages/inventory/Groups';
// ... import lainnya

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/inventory/groups" element={<Groups />} />
        {/* ... route lainnya */}
      </Routes>
    </BrowserRouter>
  );
}