import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Config } from '../types/config';
import { ConfigRepository } from '../repositories/configRepository';

interface CurrentConfigContextValue {
  currentConfig: Config | null;
  configs: Config[];
  setCurrentConfig: (id: string) => Promise<void>;
  reloadCurrentConfig: () => Promise<void>;
  reloadConfigs: () => Promise<void>;
  isLoading: boolean;
}

const CurrentConfigContext = createContext<CurrentConfigContextValue | undefined>(undefined);

export const CurrentConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentConfig, setCurrentConfigState] = useState<Config | null>(null);
  const [configs, setConfigs] = useState<Config[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const configRepo = React.useMemo(() => new ConfigRepository(), []);

  const reloadConfigs = useCallback(async () => {
    try {
      const allConfigs = await configRepo.findAllConfigs();
      setConfigs(allConfigs);
    } catch (e) {
      console.error('Failed to load configs:', e);
    }
  }, [configRepo]);

  const reloadCurrentConfig = useCallback(async () => {
    try {
      const config = await configRepo.findCurrentConfig();
      setCurrentConfigState(config);
      await reloadConfigs();
    } catch (e) {
      console.error('Failed to load current config:', e);
    } finally {
      setIsLoading(false);
    }
  }, [configRepo, reloadConfigs]);

  const setCurrentConfig = useCallback(async (id: string) => {
    await configRepo.setCurrentConfig(id);
    await reloadCurrentConfig();
  }, [configRepo, reloadCurrentConfig]);

  useEffect(() => {
    reloadCurrentConfig();
  }, [reloadCurrentConfig]);

  return (
    <CurrentConfigContext.Provider
      value={{
        currentConfig,
        configs,
        setCurrentConfig,
        reloadCurrentConfig,
        reloadConfigs,
        isLoading,
      }}
    >
      {children}
    </CurrentConfigContext.Provider>
  );
};

export const useCurrentConfig = (): CurrentConfigContextValue => {
  const context = useContext(CurrentConfigContext);
  if (!context) {
    throw new Error('useCurrentConfig must be used within a CurrentConfigProvider');
  }
  return context;
};
