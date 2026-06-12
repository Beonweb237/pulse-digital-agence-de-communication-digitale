import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SiteDataProvider } from '@/contexts/SiteDataContext';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Services from '@/pages/Services';
import Realisations from '@/pages/Realisations';
import Contact from '@/pages/Contact';
import About from '@/pages/About';
import Admin from '@/pages/Admin';

export default function App() {
  return (
    <HashRouter>
      <ThemeProvider>
        <SiteDataProvider>
          <Routes>
            <Route
              path="/admin"
              element={<Admin />}
            />
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/realisations" element={<Realisations />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </SiteDataProvider>
      </ThemeProvider>
    </HashRouter>
  );
}
