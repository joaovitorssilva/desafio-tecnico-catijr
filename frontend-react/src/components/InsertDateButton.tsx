import type { FC } from "react";
import CalendarIcon from "../assets/calendar.svg";

interface Props {
  deadline?: string;
}

const InsertDateButton: FC<Props> = ({ deadline = "" }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      <button className="px-2 py-3 cursor-pointer">
        <div className="flex items-center gap-2 text-sm text-gray bg-[#E0E0E0] px-2 py-1 rounded-sm">
          <img src={CalendarIcon} alt="calendar icon" />
          <span>{formatDate(deadline)}</span>
        </div>
      </button>
    </div>
  );
};

export default InsertDateButton;
