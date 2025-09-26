import React from "react";

import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/Dialog";
import { useModal } from "@/providers/modal/use-modal";
import clsx from "clsx";

type Props = {
  title: string;
  subheading: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  executeOnClose?: () => void;
  styles?: React.CSSProperties;
};

const CustomModal = ({
  children,
  defaultOpen,
  subheading,
  title,
  executeOnClose,
  styles,
}: Props) => {
  const { isOpen, setClose } = useModal();
  return (
    <Dialog
      open={isOpen || defaultOpen}
      onOpenChange={() => {
        setClose();
        if (executeOnClose) {
          executeOnClose();
        }
      }}
    >
      <DialogContent
        className={clsx(
          "overflow-auto md:max-h-[700px] md:h-fit h-screen bg-card",
        )}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        style={styles ? styles : {}}
      >
        <DialogHeader className="pt-8 text-left">
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription>{subheading}</DialogDescription>
          {children}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
