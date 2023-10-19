import { twMerge } from "tailwind-merge";

export interface ContainerProps {
  children: React.ReactNode;
  alignBottom?: boolean;
  bottomMargin?: boolean;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  alignBottom,
  bottomMargin,
  className,
}) => (
  <div
    className={twMerge(
      "w-full flex flex-col justify-start items-start",
      alignBottom &&
        "fixed bottom-0 left-0 w-full px-4 py-4 sm:px-6 sm:py-6 bg-white bg-opacity-80",
      bottomMargin && "mb-24",
      className
    )}
  >
    {children}
  </div>
);

export default Container;
