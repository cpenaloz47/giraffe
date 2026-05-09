import { Outlet } from 'react-router-dom';
import OfferBanner from './OfferBanner';
import Navbar from './Navbar';
import Footer from './Footer';
import LoginModal from '../modals/LoginModal';
import { useScrollTop } from '../../hooks/useScrollTop';

export default function Layout() {
  useScrollTop();

  return (
    <>
      <OfferBanner />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <LoginModal />
    </>
  );
}
