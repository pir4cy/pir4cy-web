import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface NavLink {
  name: string;
  path: string;
}

interface MobileMenuSidebarProps {
  navLinks: NavLink[];
  isMobileMenuOpen: boolean;
  closeMobileMenu: () => void;
}

const MobileMenuSidebar: React.FC<MobileMenuSidebarProps> = ({
  navLinks,
  isMobileMenuOpen,
  closeMobileMenu,
}) => (
  <motion.div
    className={`md:hidden fixed inset-0 z-50 bg-dark-950 ${isMobileMenuOpen ? 'block' : 'hidden'}`}
    initial={{ x: '100%' }}
    animate={{ x: isMobileMenuOpen ? 0 : '100%' }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex justify-end p-4">
      <button
        className="p-2 text-dark-300 hover:text-white focus:outline-none"
        onClick={closeMobileMenu}
        aria-label="Close menu"
      >
        <X className="h-6 w-6" />
      </button>
    </div>
    <nav className="flex flex-col items-center justify-center h-full gap-8">
      {navLinks.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          className={({ isActive }) => `text-xl ${isActive ? 'nav-link-active' : 'nav-link'}`}
          onClick={closeMobileMenu}
          end={link.path === '/'}
        >
          {link.name}
        </NavLink>
      ))}
    </nav>
  </motion.div>
);

export default MobileMenuSidebar;