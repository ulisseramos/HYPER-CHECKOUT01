import React, { createContext, useContext, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-24px) scale(0.98); }
  to { opacity: 1; transform: none; }
`;
const fadeOut = keyframes`
  from { opacity: 1; transform: none; }
  to { opacity: 0; transform: translateY(-24px) scale(0.98); }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
`;
const ToastBox = styled.div`
  min-width: 240px;
  max-width: 340px;
  background: #18181f;
  color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px #0007;
  border: 1.5px solid #23232b;
  padding: 18px 22px 16px 22px;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: ${props => props.$leaving ? fadeOut : fadeIn} 0.32s cubic-bezier(.77,0,.18,1);
  transition: background 0.18s, border 0.18s;
`;
const ToastTitle = styled.div`
  font-weight: 700;
  font-size: 1.08rem;
  margin-bottom: 2px;
`;
const ToastMsg = styled.div`
  font-size: 0.98rem;
`;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((toast) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(ts => [...ts, { ...toast, id }]);
    setTimeout(() => {
      setToasts(ts => ts.map(t => t.id === id ? { ...t, leaving: true } : t));
      setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 320);
    }, toast.duration || 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer>
        {toasts.map(t => (
          <ToastBox key={t.id} $leaving={t.leaving}>
            <div style={{ flex: 1 }}>
              {t.title && <ToastTitle>{t.title}</ToastTitle>}
              <ToastMsg>{t.message}</ToastMsg>
            </div>
          </ToastBox>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
} 