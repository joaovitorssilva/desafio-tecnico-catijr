import type { MouseEventHandler } from 'react';
import UserIcon from '../assets/user.svg';

type Props = {
  name?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function ProfileButton({ name = 'User Name', onClick }: Props) {
  return (
    <button onClick={onClick} className='flex items-center rounded-xl md:hover:bg-options-button-hover py-1 px-4  gap-2 transition ease-in duration-150 cursor-pointer'>
      <div className="mr-1">
        <img className='h-6 w-6 md:h-8 md:w-8' src={UserIcon} alt='user image' />
      </div>
      <div className="hidden md:flex">
          <span className='font-medium text-white'>{name}</span>
      </div>
    </button>
  );
}
