import React from 'react';
import { ThemeProvider } from './components/theme-provider';

function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="pawqar-theme">
      {children}
    </ThemeProvider>
  );
}

export default App;