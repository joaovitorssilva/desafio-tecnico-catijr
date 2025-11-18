import { useEffect, useRef, useState, type FC } from 'react';
import ListOptionsButton from '../assets/ListOptionsButton.svg';

interface Props {
  initialTitle?: string;
  onTitleChange?: (title: string) => void;
}

const ListTitle: FC<Props> = ({ initialTitle = 'A Fazer', onTitleChange }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(initialTitle);
  const [originalTitle, setOriginalTitle] = useState<string>(initialTitle);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleTitleClick = () => {
    setOriginalTitle(title);
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (title.trim() === '') {
      setTitle(originalTitle);
    } else if (onTitleChange) {
      onTitleChange(title);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setTitle(originalTitle);
      setIsEditing(false);
    }
  };

  return (
    <div className='flex items-center justify-between py-4 cursor-pointer'>
      {isEditing ? (
        <input
          ref={inputRef}
          type='text'
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className='text-white font-semibold text-base md:text-xl'
        />
      ) : (
        <p onClick={handleTitleClick} className='text-white font-semibold text-base md:text-xl'>
          {title}
        </p>
      )}

      <button className='hover:bg-options-button-hover rounded-sm transition duration-150 ease-in-out cursor-pointer'>
        <img src={ListOptionsButton} alt='options' />
      </button>
    </div>
  );
};

export default ListTitle;
