import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  // Persistência no localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) setCollapsed(saved === 'true');
  }, []);
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', collapsed);
  }, [collapsed]);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
} 