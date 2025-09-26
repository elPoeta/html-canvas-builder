import { useEffect } from "react";
import { useCompiler } from "@/providers/compiler/use-compiler";
import { useToast } from "@/providers/toaster/use-toast";
import clsx from "clsx";

export type CompilerMessageProps = {
  children: React.ReactNode;
};

export const CompilerMessage: React.FC<CompilerMessageProps> = ({
  children,
}) => {
  const { toast } = useToast();
  const { compilerState, compilerDispatch } = useCompiler();

  useEffect(() => {
    if (compilerState.message.text === "") {
      return;
    }
    if (!compilerState.message.hasMessage) {
      compilerDispatch({
        type: "SET_COMPILER_MESSAGE",
        payload: { message: { text: "", hasMessage: false, type: "Unset" } },
      });
    }
    toast({
      title: compilerState.message.type,
      description: compilerState.message.text,
      className: clsx("font-bold", {
        "bg-red-500 text-white": compilerState.message.type === "Error",
        "bg-yellow-500 text-black": compilerState.message.type === "Warning",
        "bg-green-600 text-white": compilerState.message.type === "Success",
        "bg-blue-500 text-white": compilerState.message.type === "Info",
      }),
      duration: 8000,
    });
  }, [compilerDispatch, compilerState.message, toast]);

  return <>{children}</>;
};
