import PlusCircleIcon from '../assets/plus-circle.svg';

const NewTaskButton = () => {
  return (
    <button>
      <div className='flex item-center gap-4 p-2.5 rounded-md transition duration-150 ease-in-out cursor-pointer hover:bg-options-button-hover'>
        <img src={PlusCircleIcon} alt='plus circle icon' />
        <span className='text-md font-semibold text-white font-family-poppins'>Nova Tarefa</span>
      </div>
    </button>
  );
};

export default NewTaskButton;
