import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/user/authSlice';

const Module1 = () => {
  const [message, setMessage] = useState('');
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    axios
      .get('/api/users')
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  }, []);

  return (
    <main className="flex flex-col gap-4 w-full h-[100vh] justify-center items-center">
      <a>Hello World {message}</a>
      <a>{currentUser?.name} is logged in</a>
    </main>
  );
};

export default Module1;
