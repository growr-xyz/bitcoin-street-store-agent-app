import Link from "next/link";
import { twJoin, twMerge } from "tailwind-merge";

export interface CardProps {
  title: React.ReactNode;
  href?: string;
  subtitle?: React.ReactNode;
  pillLabel?: string;
  pillColor?: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  href,
  subtitle,
  pillLabel,
  pillColor = "bg-stone-500",
  className,
}) => {
  const CardContents = () => (
    <>
      <div className="flex flex-row w-full gap-2 items-center justify-start mb-2">
        <div className="font-bold items-center">{title}</div>
        {pillLabel && (
          <div
            className={twJoin(
              "p-1 rounded text-white text-xs font-normal",
              pillColor
            )}
          >
            {pillLabel}
          </div>
        )}
      </div>
      <div className="text-sm">{subtitle}</div>
    </>
  );

  const cardClassName = twMerge(
    "rounded-lg border border-stone-200 p-4 bg-stone-100 cursor-pointer hover:bg-stone-200 focus:outline-orange-900",
    className
  );

  return href ? (
    <Link href={href} className={cardClassName}>
      <CardContents />
    </Link>
  ) : (
    <div className={cardClassName}>
      <CardContents />
    </div>
  );
};

export default Card;
