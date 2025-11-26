import { useContext } from "react";
import { CaptainDataContext } from "./CaptainDataContext";

export const useCaptain = () => {
  const context = useContext(CaptainDataContext);
  if (!context) {
    throw new Error("useCaptain must be used within CaptainProvider");
  }
  return context;
};
