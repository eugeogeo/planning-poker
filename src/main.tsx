import { BrowserRouter } from 'react-router-dom'; // Importe isso
import App from './App';
import { SocketProvider } from './context/SocketContext';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <SocketProvider>
      <App />
    </SocketProvider>
  </BrowserRouter>,
);
