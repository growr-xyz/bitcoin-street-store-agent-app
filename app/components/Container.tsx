import { twMerge } from "tailwind-merge";

export interface ContainerProps {
  children: React.ReactNode;
  alignBottom?: boolean;
  fullHeight?: boolean;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  alignBottom,
  fullHeight,
  className,
}) => (
  <div
    className={twMerge(
      "w-full flex flex-col justify-start items-start",
      alignBottom &&
        "fixed bottom-0 left-0 w-full px-4 py-4 sm:px-6 sm:py-6 bg-white bg-opacity-80", // mt-auto pt-4",
      fullHeight && "mb-24",
      // "min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100dvh-6rem)] justify-between",
      className
    )}
  >
    {children}
  </div>
);

export default Container;
