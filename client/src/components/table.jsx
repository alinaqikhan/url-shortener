import { useEffect, useState } from 'react';

import { RotatingLines } from 'react-loader-spinner';

const Table = () => {
  const [urlsList, setUrlsList] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getURLs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8080?page=${page}`);
        const data = await response.json();
        setUrlsList(data.urls);
      } catch (err) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getURLs();
  }, [page]);

  return (
    <div className='h-80'>
      {isLoading ? (
        <div className='size-full flex justify-center items-center'>
          <RotatingLines
            height='44'
            width='44'
            strokeWidth='4'
            strokeColor='#3B81F6'
            animationDuration='0.75'
            ariaLabel='rotating-lines-loading'
          />
        </div>
      ) : (
        <table className='bg-slate-200/70 w-full max-w-2xl mx-auto rounded'>
          <thead>
            <tr className='divide-x-2 text-white'>
              <th className='p-4 bg-[#3B81F6] rounded-tl'>Original URL</th>
              <th className='p-4 bg-[#3B81F6]'>Shortened URL</th>
              <th className='p-4 bg-[#3B81F6] rounded-tr'>No. of Clicks</th>
            </tr>
          </thead>
          <tbody>
            {urlsList.map(url => (
              <tr key={url._id} className='divide-x-2 divide-white divide-y-2'>
                <td className='p-4 text-center'>{url.fullUrl}</td>
                <td className='p-4 text-center'>
                  <a
                    className='underline text-blue-700 visited:text-purple-900'
                    href={`/${url.shortUrl}`}
                  >
                    /{url.shortUrl}
                  </a>
                </td>
                <td className='p-4 text-center'>{url.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Table;
