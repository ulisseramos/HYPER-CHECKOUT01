import React, { createContext, useState, useEffect } from 'react';
import '../styles/globals.css';
import Cookies from 'js-cookie';
import { ThemeProvider } from 'styled-components';
import theme from '../styles/theme';
import { SidebarProvider } from '../components/SidebarContext';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/router';
import { ToastProvider } from '../components/ToastProvider';
import SupabaseRealtimeListener from '../components/SupabaseRealtimeListener';
import { NotificationProvider } from '../components/NotificationContext';

export const AuthContext = createContext();

export default function App({ Component, pageProps, router }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const nextRouter = useRouter();

  useEffect(() => {
    const token = Cookies.get('auth_token');
    setIsAuthenticated(!!token);
    // Corrigir: permitir acesso livre ao checkout
    if (!token &&
      nextRouter.pathname !== '/login' &&
      nextRouter.pathname !== '/register' &&
      !nextRouter.pathname.startsWith('/checkout')
    ) {
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
          <NotificationProvider>
            <ToastProvider>
              <SupabaseRealtimeListener />
              <div style={{ display: 'flex', minHeight: '100vh' }}>
                {nextRouter.pathname !== '/login' && nextRouter.pathname !== '/register' && !nextRouter.pathname.startsWith('/checkout') && <Sidebar />}
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
            </ToastProvider>
          </NotificationProvider>
        </AuthContext.Provider>
      </SidebarProvider>
    </ThemeProvider>
  );
} 