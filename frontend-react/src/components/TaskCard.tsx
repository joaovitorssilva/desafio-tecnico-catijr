import { useState, type FC, type MouseEvent } from 'react';
import FinishTaskButton from './FinishTaskButton';
import InsertDateButton from './InsertDateButton';
import EditingCard from './EditingCard';

type Priority = 'veryHigh' | 'high' | 'medium' | 'low';

interface Props {
  priority?: Priority;
  title?: string;
  description?: string;
  deadline?: string;
}

const TaskCard: FC<Props> = ({
  priority = 'low',
  title = 'tittle',
  description = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam rerum beatae quo? Vitae enim adipisci eveniet est sed odio ipsum.',
  deadline = '2025-12-20',
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const priorityStyles: Record<Priority, { style: string; label: string }> = {
    veryHigh: {
      style: 'bg-veryHighPrio text-veryHighPrioText',
      label: 'Altíssima Prioridade',
    },
    high: {
      style: 'bg-highPrio text-highPrioText',
      label: 'Alta Prioridade',
    },
    medium: {
      style: 'bg-mediumPrio text-mediumPrioText',
      label: 'Média Prioridade',
    },
    low: {
      style: 'bg-lowPrio text-lowPrioText',
      label: 'Baixa Prioridade',
    },
  };

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest('button')) return;
    setIsEditing(true);
  };

  if (isEditing) {
    return <EditingCard />;
  }

  return (
    <div
      onClick={handleCardClick}
      className='w-full max-w-sm md:max-w-md rounded-lg border border-options-button-hover hover:border-white hover:bg-linear-to-r hover:from-[#393939] hover:to-[#232323] transition duration-150 ease-in overflow-hidden '
    >
      {/* Card Header*/}
      <div className='flex items-center align-center justify-between px-2 py-3 '>
        <span
          className={`px-4 py-1 text-sm font-semibold rounded-sm ${priorityStyles[priority].style}`}
        >
          {priorityStyles[priority].label}
        </span>
        <FinishTaskButton />
      </div>

      {/* Card Text Area */}
      <div className='px-2 '>
        <h6 className='text-[19.2px] font-semibold text-white mb-0.5'>{title}</h6>
        <p className='text-[16px] font-normal text-white'>{description}</p>
      </div>

      {/* Card Footer */}
      <InsertDateButton deadline={deadline} />
    </div>
  );
};

export default TaskCard;
