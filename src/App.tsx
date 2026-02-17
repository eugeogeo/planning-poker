import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import AppRoutes from './pages/routes'; // Importa as rotas que acabamos de corrigir

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
