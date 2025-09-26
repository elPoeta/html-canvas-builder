import { useCompiler } from "@/providers/compiler/use-compiler";
import { useEffect, useState } from "react";

export const CompilerSpinner = () => {
  const { compilerState } = useCompiler();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(compilerState.isLoading);
  }, [compilerState.isLoading]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-2 bg-black bg-opacity-50 z-[900]">
      <div className="w-20 h-20 border-4 border-t-transparent border-orange-500 rounded-full animate-spin"></div>
      <p className="font-boldl text-orange-500 text-center">Loading...</p>
    </div>
  );
};
