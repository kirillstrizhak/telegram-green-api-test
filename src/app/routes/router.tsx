import { createBrowserRouter } from 'react-router';
import AuthPage from '../../pages/AuthPage/ui/AuthPage';
import { ProtectedRoute } from './ProtectedRoute';
import ChatsPage from '../../pages/ChatsPage/ui/ChatsPage';

export const router = createBrowserRouter([
  { path: '/', element: <AuthPage /> },
  {
    element: <ProtectedRoute />,
    children: [{ path: '/chats', element: <ChatsPage /> }],
  },
]);