import CustomModal from "@/components/global/modal/CustomModal";
import { FC } from "react";

type FrameRenderModalProps = {
  url: string;
  style?: React.CSSProperties;
};

export const FrameRenderModal: FC<FrameRenderModalProps> = ({ url, style }) => {
  return (
    <CustomModal
      title=""
      subheading=""
      styles={{ maxWidth: "85%", minHeight: "90%", ...(style ? style : {}) }}
    >
      <div className="w-full h-full shadow-lg  border-2">
        <iframe
          src={url}
          width="100%"
          height="100%"
          allowFullScreen
          className="border-0"
        />
      </div>
    </CustomModal>
  );
};
