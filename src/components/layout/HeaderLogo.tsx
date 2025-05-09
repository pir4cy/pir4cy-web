import { Link } from 'react-router-dom';

const HeaderLogo = () => (
  <Link to="/" className="flex items-center gap-2">
    <img
      src="/images/logos/main-logo.png"
      alt="pir4cy logo"
      className="h-10 w-10 object-contain drop-shadow-lg"
      style={{ marginRight: '0.5rem' }}
    />
    <span className="text-2xl font-grotesk font-bold tracking-tight">
      <span className="text-white">pir</span>
      <span className="text-primary-500">4</span>
      <span className="text-white">cy</span>
    </span>
  </Link>
);

export default HeaderLogo;