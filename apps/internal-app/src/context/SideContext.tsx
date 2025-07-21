import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Side } from "@shared/types/domain.types";

type SideContextType = {
  side: Side;
  setSide: (side: Side) => void;
};

const SideContext = createContext<SideContextType | undefined>(undefined);

export const SideProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [side, setSide] = useState<Side>(Side.One);

  useEffect(() => {
    if (!user) return;

    const initialSide = user.side === Side.Both ? Side.One : user.side;
    setSide(initialSide as Side);
  }, [user]);

  return (
    <SideContext.Provider value={{ side, setSide }}>
      {children}
    </SideContext.Provider>
  );
};

export const useSide = (): SideContextType => {
  const context = useContext(SideContext);
  if (!context) {
    throw new Error("useSide must be used within a SideProvider");
  }
  return context;
};
