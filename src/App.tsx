import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Room from './pages/Rooms/Room';

// Componentes temporários (se você ainda não criou os reais)
const NotFound = () => <h1>404 - Página não encontrada</h1>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:roomId" element={<Room />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
