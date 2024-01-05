import ErrorMessage from '../errorMessage/ErrorMessage';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';

const Page404 = () => {
  const navigate = useNavigate()

  return (
    <div>
      <Helmet>
        <meta
          name="description"
          content="Page not found"
        />
        <title>Page not found</title>
      </Helmet>
      <ErrorMessage/>
      <p style={{'textAlign': 'center', 'fontWeight': '700', 'fontSize': '24px'}}>Page doesn't exist</p>
      <Link style={{'display': 'block', 'textAlign': 'center', 'fontWeight': '700', 'fontSize': '24px', 'marginTop': '30px'}} to={window.history.length > 2 ? navigate(-1) : '/'}>Come back</Link>
    </div>
  );
}

export default Page404;