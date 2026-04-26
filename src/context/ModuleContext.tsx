'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

import { MODULES, ModuleConfig } from '@/constants/modules';

export type ModuleType = 'grocery' | 'pharmacy' | 'food' | 'shop' | 'parcel' | 'ride' | 'service' | 'classified';

interface ModuleContextType {
  activeModule: ModuleType;
  setActiveModule: (module: ModuleType) => void;
  getModuleConfig: () => ModuleConfig;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export function ModuleProvider({ children }: { children: React.ReactNode }) {
  const [activeModule, setActiveModule] = useState<ModuleType>('shop');

  // Load from local storage if available
  useEffect(() => {
    const saved = localStorage.getItem('activeModule') as ModuleType;
    if (saved) setActiveModule(saved);
  }, []);

  const handleSetActiveModule = (module: ModuleType) => {
    setActiveModule(module);
    localStorage.setItem('activeModule', module);
  };

  const getModuleConfig = () => {
    return MODULES.find(m => m.id === activeModule) || MODULES[3]; // Default to 'shop'
  };

  return (
    <ModuleContext.Provider value={{ activeModule, setActiveModule: handleSetActiveModule, getModuleConfig }}>
      {children}
    </ModuleContext.Provider>
  );
}

export function useModule() {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error('useModule must be used within a ModuleProvider');
  }
  return context;
}
