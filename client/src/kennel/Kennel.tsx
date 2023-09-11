import axios from 'axios';
import { useEffect, useState } from 'react';

const Kennel = () => {
	const [message, setMessage] = useState('');

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

	return <p>Hello World {message}</p>;
};

export default Kennel;
