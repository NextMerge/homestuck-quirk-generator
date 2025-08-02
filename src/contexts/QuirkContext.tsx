import { createContext, useContext, useState, type ReactNode } from "react";

interface QuirkContextType {
  inputText: string;
  setInputText: (text: string) => void;
}

const QuirkContext = createContext<QuirkContextType | undefined>(undefined);

export function useQuirkContext(): QuirkContextType {
  const context = useContext(QuirkContext);
  if (!context) {
    throw new Error("useQuirkContext must be used within a QuirkProvider");
  }
  return context;
}

interface QuirkProviderProps {
  children: ReactNode;
}

export function QuirkProvider({ children }: QuirkProviderProps) {
  const [inputText, setInputText] = useState<string>("");

  return (
    <QuirkContext.Provider value={{ inputText, setInputText }}>
      {children}
    </QuirkContext.Provider>
  );
}
