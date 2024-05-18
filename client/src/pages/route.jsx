import { useParams } from 'react-router-dom';

const RoutePage = () => {
  const { shortUrl } = useParams();
  return (
    <div>
      <h1>Route Page</h1>
    </div>
  );
};

export default RoutePage;
