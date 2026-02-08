import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';

// Componentes temporários (se você ainda não criou os reais)
const Room = () => <h1>🃏 Sala de Poker</h1>;
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
