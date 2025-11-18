import CheckIcon from '../assets/check-icon.svg';
import CheckIcon2 from '../assets/check-icon2.svg';
import CheckIcon3 from '../assets/check-icon3.png';

import { useState } from 'react';

const FinishTaskButton = () => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button className='flex items-center gap-1' onClick={() => setIsCompleted(!isCompleted)}>
      {isCompleted ? (
        <div className='flex items-center gap-1 transition duration-150 ease-out cursor-pointer'>
          <img src={CheckIcon3} />
          <span className='text-lowPrioText font-normal'>Finalizado</span>
        </div>
      ) : (
        <>
          <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            {isHovered ? (
              <div className='flex items-center gap-1 transition duration-150 ease-out cursor-pointer'>
                <img src={CheckIcon2} className='' />
                <div>
                  <span className='text-[#15C384] font-normal '>Finalizar</span>
                </div>
              </div>
            ) : (
              <div className='flex items-center gap-1 transition duration-150 ease-in cursor-pointer'>
                <img src={CheckIcon} className='' />
                <div>
                  <span className='text-white font-normal  '>Finalizar</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </button>
  );
};

export default FinishTaskButton;
