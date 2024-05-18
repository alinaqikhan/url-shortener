import { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { RotatingLines } from 'react-loader-spinner';

const schema = zod.object({
  url: zod.string().min(1, 'URL is required').url({ message: 'Invalid URL' }),
});

const InputForm = () => {
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });

  watch('url');

  const submitHandler = async data => {
    setShortenedUrl('');
    setIsLoading(true);
    setError(null);
    const { url } = data;
    try {
      const response = await fetch('http://localhost:8080/', {
        method: 'POST',
        body: JSON.stringify({ fullUrl: url }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      console.log(result);
      if (!response.ok) {
        setShortenedUrl(result.data.shortUrl);
        throw new Error(result.message);
      }
      console.log(result);
      setShortenedUrl(result.url.shortUrl);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const subscription = watch(value => {
      if (value.url || !value.url) {
        setError(null);
        setShortenedUrl('');
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className='p-5 lg:p-12 space-y-6 lg:space-y-12'>
      <h2 className='font-bold text-center text-xl lg:text-3xl'>
        URL Shortener
      </h2>
      <div className='bg-slate-200/70 space-y-2 rounded p-5 lg:px-12 max-w-xl mx-auto'>
        <p className='lg:text-lg text-center'>Paste the URL to be shortened</p>
        <form
          onSubmit={handleSubmit(submitHandler)}
          noValidate
          className='flex flex-col lg:flex-row gap-2'
        >
          <label htmlFor='url' className='sr-only'>
            URL
          </label>
          <input
            type='url'
            id='url'
            placeholder='https://example.com'
            {...register('url')}
            className='outline-none w-full px-4 py-2 rounded shadow-sm focus:shadow transition-all duration-300 ease-out ring-2 ring-transparent focus:ring-blue-500'
            autoComplete='off'
            readOnly={isLoading}
          />
          <div className='shrink-0 relative self-end'>
            <button
              disabled={isLoading}
              className='bg-blue-500 px-4 font-semibold text-white py-2 rounded shadow-sm transition-all ring-2 ring-transparent duration-300 ease-out hover:bg-blue-600 active:ring-blue-500 active:bg-blue-500 disabled:bg-white disabled:cursor-not-allowed disabled:ring-0'
              type='submit'
            >
              Shorten URL
            </button>
            {isLoading && (
              <div className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
                <RotatingLines
                  height='28'
                  width='28'
                  strokeWidth='4'
                  strokeColor='#3B81F6'
                  animationDuration='0.75'
                  ariaLabel='rotating-lines-loading'
                />
              </div>
            )}
          </div>
        </form>

        {errors.url && (
          <p className='text-red-600 text-sm'>{errors.url.message}</p>
        )}

        {error && <p className='text-red-600 text-sm'>{error}</p>}

        {shortenedUrl && (
          <div className='flex gap-2'>
            <p className=''>Your shortened URL:</p>
            <a
              href={shortenedUrl}
              target='_blank'
              rel='noreferrer'
              className='text-blue-500 underline break-all'
            >
              http://localhost:5173/{shortenedUrl}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputForm;
