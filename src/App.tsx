import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PublicLayout } from './layouts/PublicLayout';
import { ScrollToTop } from './components/common/ScrollToTop';
import { PageLoader } from './components/common/PageLoader';

// Route-level code splitting keeps the initial bundle small.
const Home = lazy(() => import('./pages/Home/Home'));
const BlogList = lazy(() => import('./pages/Blog/BlogList'));
const BlogDetails = lazy(() => import('./pages/BlogDetails/BlogDetails'));
const About = lazy(() => import('./pages/About/About'));
const Contact = lazy(() => import('./pages/Contact/Contact'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));
const Admin = lazy(() => import('./pages/Admin/Admin'));
const AdminEditor = lazy(() => import('./pages/Admin/AdminEditor'));

export default function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Admin has its own chrome (no public navbar/footer). */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/new" element={<AdminEditor />} />
            <Route path="/admin/edit/:id" element={<AdminEditor />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  );
}
