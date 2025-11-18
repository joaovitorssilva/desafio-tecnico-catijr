import NotificationBell from '../assets/notification1.svg';

const NotificationButton = () => {
  return (
    <div className='p-1 hover:bg-options-button-hover transition duration-150 ease-in cursor-pointer'>
      <img src={NotificationBell} alt='notification icon' />
    </div>
  );
};
export default NotificationButton;
