import { createContext, useContext } from 'react';

export const ApiConfigContext = createContext(null);

export const ApiConfigProvider = ({ children, value }) => (
  <ApiConfigContext.Provider value={value}>
    {children}
  </ApiConfigContext.Provider>
);

export const useApiConfig = () => {
  const context = useContext(ApiConfigContext);
  if (!context) {
    throw new Error('useApiConfig must be used within an ApiConfigProvider');
  }
  return context;
};
