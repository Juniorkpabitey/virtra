import { isAuthenticated } from '../utils/auth';

export const requireAuth = (WrappedComponent) => {
  return (props) => {
    if (!isAuthenticated()) {
      window.location.href = '/login';
      return null; // prevent rendering
    }
    return <WrappedComponent {...props} />;
  };
};
