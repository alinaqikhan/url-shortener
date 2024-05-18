import { useEffect, useState } from 'react';

import { RotatingLines } from 'react-loader-spinner';

const ITEMS_PER_PAGE = 5;

const Table = () => {
  const [urlsList, setUrlsList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
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
        setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE));
      } catch (err) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    getURLs();
  }, [page]);

  return (
    <div className='relative'>
      {isLoading && (
        <div className='absolute top-2.5 left-[75%] flex justify-center items-center'>
          <RotatingLines
            height='32'
            width='32'
            strokeWidth='4'
            strokeColor='#3B81F6'
            animationDuration='0.75'
            ariaLabel='rotating-lines-loading'
          />
        </div>
      )}
      <table className='bg-slate-200/70 w-full max-w-2xl mx-auto rounded overflow-auto'>
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
      <div className='mt-2 flex gap-4 justify-center text-white'>
        <button
          disabled={page === 1}
          onClick={() =>
            setPage(page => {
              if (page === 1) {
                return 1;
              }
              return page - 1;
            })
          }
          className='bg-blue-500 p-1 px-3 rounded active:bg-blue-600 transition-all duration-300 ease-out disabled:bg-blue-200 disabled:cursor-not-allowed'
        >
          Previous
        </button>
        <button className='ring-1 text-blue-500 ring-blue-500 p-1 px-3 rounded'>
          {page}
        </button>
        <button
          disabled={page === totalPages}
          onClick={() => {
            setPage(page => {
              if (page < totalPages) {
                return page + 1;
              }
              return page;
            });
          }}
          className='bg-blue-500 p-1 px-3 rounded active:bg-blue-600 transition-all duration-300 ease-out disabled:bg-blue-200 disabled:cursor-not-allowed'
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
