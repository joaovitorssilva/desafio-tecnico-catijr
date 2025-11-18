import FinishTaskButton from './FinishTaskButton';
import CloseTaskButton from '../assets/CloseTaskButton.svg';
import { useState, type FC } from 'react';

const EditingCard: FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <div className='min-h-screen items-start justify-center'>
      <div className='w-full max-w-md rounded-lg'>
        <header className='flex align-center justify-between'>
          <button onClick={() => setIsEditing(false)} className='cursor-pointer'>
            <img src={CloseTaskButton} alt='close task button' />
          </button>
          <FinishTaskButton />
        </header>

        <div className='space-y-2'>
          <label className='text-sm text-white font-medium'>Data de conclusão</label>
          <div className='flex items-center gap-2 bg-neutral-700 px-4 py-2 rounded-md'>
            <svg
              className='w-5 h-5 text-neutral-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <rect x='3' y='4' width='18' height='18' rx='2' ry='2' strokeWidth='2' />
              <line x1='16' y1='2' x2='16' y2='6' strokeWidth='2' />
              <line x1='8' y1='2' x2='8' y2='6' strokeWidth='2' />
              <line x1='3' y1='10' x2='21' y2='10' strokeWidth='2' />
            </svg>
            <span className='text-white text-sm'>23 JAN, 2024</span>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default EditingCard;
