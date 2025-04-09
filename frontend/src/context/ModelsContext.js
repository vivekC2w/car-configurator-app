import { createContext, useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchModels } from '../services/api';

const ModelsContext = createContext();

export function ModelsProvider({ children }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['models'],
    queryFn: fetchModels,
    staleTime: 5 * 60 * 1000,
  });

  // Memoize the context value to avoid unnecessary re-renders
  const value = useMemo(() => ({
    models: data?.data || [],
    loading: isLoading,
    error,
    getModelsByName: (name) => data?.data.find((model) => model.name === name),
  }), [data, isLoading, error]);

  return (
    <ModelsContext.Provider value={ value }>
      {children}
    </ModelsContext.Provider>
  );
}

export function useModels() {
  const context = useContext(ModelsContext);
  console.log(context);
  if (!context) {
    throw new Error('useModels must be used within a ModelsProvider');
  }
  return context;
}