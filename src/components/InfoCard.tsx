import cn from "classnames";

interface IInfoCard {
  children: React.ReactNode;
  className?: string;
}

export const InfoCard = ({ children, className }: IInfoCard) => {
  return (
    <p
      className={cn(
        "text-center text-normal font-semibold rounded-md border p-2  shadow-md border-opacity-50",
        className,
      )}
    >
      {children}
    </p>
  );
};
