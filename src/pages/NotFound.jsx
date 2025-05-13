import { Link } from 'react-router-dom';
import getIcon from '../utils/iconUtils';

const ArrowLeftIcon = getIcon('ArrowLeft');

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-surface-50 dark:bg-surface-900">
      <h1 className="text-7xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-100 mb-6">Page Not Found</h2>
      <p className="text-surface-600 dark:text-surface-400 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/" className="flex items-center px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors">
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;