import ProfileButton from './ProfileButton';
import NotificationButton from './NotificationButton';

const Navbar = () => {
  return (
    <nav className='bg-linear-to-r from-bgLight to-[#4C4444] shadow-md flex items-center justify-between w-full px-20 py-3 text-white'>
      <div>
        <p className='text-lg sm:text-xl font-extrabold tracking-wider'>Minhas Tarefas</p>
      </div>
      <div className='flex items-center'>
        <div>
          <NotificationButton />
        </div>
        <div>
          <ProfileButton name="João Vitor"/>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
