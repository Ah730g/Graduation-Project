import { createBrowserRouter } from 'react-router-dom';
import { Layout, AuthLayout } from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import ListPage from './pages/ListPage';
import EstateInfo from './pages/EstateInfo';
import Profile from './pages/Profile';
import GuestLayout from './components/GuestLayout';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Signup from './pages/Signup';
import UpdateUser from './pages/UpdateUser';
import AddPost from './pages/AddPost';
import EstateInfoLoader from './Lib/Loaders';

const route = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/list',
        element: <ListPage />,
      },
      {
        path: '/:id',
        element: <EstateInfo />,
        loader: EstateInfoLoader,
      },
      {
        path: '/',
        element: <GuestLayout />,
        children: [
          {
            path: '/',
            element: <Home />,
          },
          {
            path: '/login',
            element: <Login />,
          },
          {
            path: '/signup',
            element: <Signup />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '/user/profile',
        element: <Profile />,
      },
      {
        path: '/user/profile/update',
        element: <UpdateUser />,
      },
      {
        path: '/post/add',
        element: <AddPost />,
      },
    ],
  },
]);
export default route;
