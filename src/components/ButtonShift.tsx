import { Button } from "./ui/button";
import cn from "classnames";

interface IButtonShift {
  onClick: () => void;
  label: string;
  className?: string;
}
export const ButtonShift = ({ onClick, label, className }: IButtonShift) => {
  return (
    <Button onClick={onClick} className={cn("font-semibold text-sm text-white shadow-md", className)}>
      {label}
    </Button>
  );
};
