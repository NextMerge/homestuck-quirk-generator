import { createContext, useContext, useState, type ReactNode } from "react";

type QuirkContextType = {
  inputText: string;
  setInputText: (text: string) => void;
};

const QuirkContext = createContext<QuirkContextType | undefined>(undefined);

export function useQuirkContext(): QuirkContextType {
  const context = useContext(QuirkContext);
  if (!context) {
    throw new Error("useQuirkContext must be used within a QuirkProvider");
  }
  return context;
}

type QuirkProviderProps = {
  children: ReactNode;
};

export const phrase = "the quick brown fox jumps over the lazy dog. :)";

export function QuirkProvider({ children }: QuirkProviderProps) {
  const [inputText, setInputText] = useState<string>(phrase);

  return (
    <QuirkContext.Provider value={{ inputText, setInputText }}>
      {children}
    </QuirkContext.Provider>
  );
}
