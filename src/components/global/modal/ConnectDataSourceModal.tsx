import { Button } from "@ui/Button";
import { Modal } from "./Modal";

type ConnectDataSourceModalProps = {
  isOpen: boolean;
  loading: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onConfirm: () => void;
};

export const ConnectDataSourceModal: React.FC<ConnectDataSourceModalProps> = ({
  isOpen,
  loading,
  title,
  description,
  onConfirm,
  onClose,
}) => {
  const handleOnClick = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      description={description}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={loading} variant="default" onClick={handleOnClick}>
          Done
        </Button>
      </div>
    </Modal>
  );
};
