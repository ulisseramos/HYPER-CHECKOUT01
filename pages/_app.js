import React, { createContext, useState, useEffect } from 'react';
import '../styles/globals.css';
import Cookies from 'js-cookie';
import { ThemeProvider } from 'styled-components';
import theme from '../styles/theme';
import { SidebarProvider } from '../components/SidebarContext';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/router';

export const AuthContext = createContext();

export default function App({ Component, pageProps, router }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const nextRouter = useRouter();

  useEffect(() => {
    const token = Cookies.get('auth_token');
    setIsAuthenticated(!!token);
    // Redireciona para login se não autenticado e não está na página de login
    if (!token && nextRouter.pathname !== '/login') {
      nextRouter.replace('/login');
    }
  }, [nextRouter]);

  // Só importa o tema escuro para rotas que não são checkout
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/checkout')) {
    require('../styles/theme.css');
  }

  return (
    <ThemeProvider theme={theme}>
      <SidebarProvider>
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
          <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #0a0012 0%, #1a0036 100%)' }}>
            {nextRouter.pathname !== '/login' && <Sidebar />}
            <div style={{ flex: 1, minHeight: '100vh' }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={router.pathname}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28, ease: 'easeInOut' }}
                  style={{ minHeight: '100vh' }}
                >
                  <Component {...pageProps} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </AuthContext.Provider>
      </SidebarProvider>
    </ThemeProvider>
  );
} 