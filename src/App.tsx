import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="pawqar-theme">
      <Outlet />
    </ThemeProvider>
  );
}

export default App;