import { User } from "@/icons";
import { DetailedHTMLProps, FC, ImgHTMLAttributes } from "react";

interface AvatarProps
  extends DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  src?: string;
}

const Avatar: FC<AvatarProps> = ({ src, className = "" }) =>
  src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={`rounded-full ${className}`}
      src={src}
      alt="Avatar"
      width={24}
      height={24}
    />
  ) : (
    <User className={`${className}`} />
  );

export default Avatar;
