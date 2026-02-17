import { Route, Routes } from 'react-router-dom';
import Home from '../Home/Home';
import Room from '../Rooms/Room';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:roomId" element={<Room />} />
    </Routes>
  );
};

export default AppRoutes;
