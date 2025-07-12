import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="text-center py-6 sm:py-8">
      <Link
        to="/privacy"
        className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm transition-colors"
      >
        Privacy Policy & Terms of Service
      </Link>
    </footer>
  );
};

export default Footer;
