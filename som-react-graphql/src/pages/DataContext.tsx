import React, { createContext, useState, ReactNode } from 'react';

interface SharedContextType<T> {
  sharedObject: T;
  setSharedObject: React.Dispatch<React.SetStateAction<T>>;
}

export const SharedContext = createContext<SharedContextType<any>>({
  sharedObject: {},
  setSharedObject: () => { },
});

interface SharedContextProviderProps {
  children: ReactNode;
}

export const SharedContextProvider: React.FC<SharedContextProviderProps> = ({ children }) => {
  const [sharedObject, setSharedObject] = useState({});

  return (
    <SharedContext.Provider value={{ sharedObject, setSharedObject }}>
      {children}
    </SharedContext.Provider>
  );
};