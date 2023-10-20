import Link from "next/link";
import { twMerge } from "tailwind-merge";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
}

const Button: React.FC<ButtonProps> = ({
  href,
  children,
  className,
  onClick,
  ...rest
}) => {
  const buttonClassName = twMerge(
    `min-w-fit rounded sm:self-auto px-4 py-2 text-normal sm:px-6 sm:py-2 bg-orange-600 text-white 
    sm:text-lg text-center whitespace-nowrap overflow-hidden overflow-ellipsis focus:outline-orange-900`,
    className
  );

  return href ? (
    <Link className={buttonClassName} href={href}>
      {children}
    </Link>
  ) : (
    <button className={buttonClassName} onClick={onClick} {...rest}>
      {children}
    </button>
  );
};

export default Button;
