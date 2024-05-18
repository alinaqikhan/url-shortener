import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

const RoutePage = () => {
  const { shortUrl } = useParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUrl = async () => {
      try {
        const response = await fetch(`http://localhost:8080/${shortUrl}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message);
        }
        console.log(data);
        window.location.href = data.url.fullUrl;
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };
    getUrl();
  }, []);

  if (error) {
    return <div className='p-5 font-bold text-2xl text-red-700'>{error}</div>;
  }

  return null;
};

export default RoutePage;
