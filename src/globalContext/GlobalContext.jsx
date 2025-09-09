"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// 1️⃣ Create context
const GlobalContext = createContext();

// 2️⃣ Provider Component
export function GlobalContextProvider({ children }) {
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);

  return (
    <GlobalContext.Provider value={{ options, loading }} >
      {children}
    </GlobalContext.Provider>
  );
}

// 3️⃣ Custom hook
export function useSetting() {
  return useContext(GlobalContext);
}
