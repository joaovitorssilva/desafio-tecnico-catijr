import ListTitle from "./ListTitle";
import NewTaskButton from './NewTaskButton';
import TaskCard from './TaskCard';

const List = () => {
  return (
    <div className='border border-options-button-hover rounded-md gap-4 px-4 '>
        <ListTitle/>    

        <TaskCard/>

        <NewTaskButton />
    </div>
  );
};

export default List;
