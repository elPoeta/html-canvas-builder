import clsx from "clsx";
import { Expand } from "lucide-react";
import { useRef, useState } from "react";

type ImageViewerProps = {
  src: string;
  alt: string;
  styles?: React.CSSProperties;
  animation?: string;
  enableExpand: boolean;
};
export const ImageViewer = ({
  src,
  alt,
  styles,
  enableExpand,
  animation,
}: ImageViewerProps) => {
  const [isExpandedOpen, setIsExpandedOpen] = useState(false);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imgRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const openExpnadModal = () => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      setIsExpandedOpen(true);
    };
  };

  const closeExpandModal = () => setIsExpandedOpen(false);

  if (!enableExpand) {
    return (
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover overflow-hidden"
        style={styles ? { ...styles } : {}}
      />
    );
  }
  return (
    <div className="w-fit h-fit">
      <div
        className="relative group w-fit h-fit"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover overflow-hidden ${animation && animation}`}
          style={styles ? { ...styles } : {}}
        />
        {enableExpand && (
          <button
            className={clsx(
              "absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2  w-8 h-8 bg-black/40 rounded-sm opacity-0  transition-opacity",
              {
                "group-hover:opacity-100": isHovered,
              },
            )}
            onClick={() => openExpnadModal()}
          >
            <Expand className="w-6 h-6 absolute top-2/4 left-2/4 -translate-x-1/2 -translate-y-1/2 stroke-white" />
          </button>
        )}
      </div>
      {isExpandedOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            overflow: "auto",
          }}
          onClick={closeExpandModal}
        >
          <div
            style={{
              backgroundColor: "transparent",
              width: `${imageSize.width}`,
              height: `calc(${imageSize.height} - 40px)`,
              overflow: "auto",
            }}
            // onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={alt}
              style={{
                width: "calc(100% - 40px)",
                height: "calc(100% - 40px)",
                display: "block",
                margin: "0 auto",
              }}
              ref={imgRef}
            />
          </div>
        </div>
      )}
    </div>
  );
};
