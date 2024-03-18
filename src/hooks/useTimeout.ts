import { useState, useEffect } from "react";

export const useTimeout = (sec = 2000) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const timeout = setTimeout(() => {
      setIsActive(false);
      clearTimeout(timeout);
    }, sec);
  }, [isActive]);

  const startActiveTimeout = () => {
    setIsActive(true);
  };

  return {
    startActiveTimeout,
    isActive,
  };
};
