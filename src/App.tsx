import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '@/components/navbar/Navbar';
import { Footer } from '@/components/footer/Footer';
import { WebConsole } from '@/components/WebConsole';
import clsx from 'clsx';
import i18n from '@/i18n';

import QrMake from '@/pages/QrMake';
import QrLoad from '@/pages/QrLoad';
import QrScan from '@/pages/QrScan';
import { MainPage } from '@/pages/MainPage';

export function App() {
  const webConsole = false;

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-center" />
      <Navbar />
      <main
        className={clsx(
          'flex-1',
          'flex',
          'bg-white text-black',
          'dark:bg-gray-900 dark:text-white'
        )}
      >
        <Routes>
          <Route path="/:urlLang">
            <Route index element={<MainPage />} />
            <Route path="qr-make" element={<QrMake />} />
            <Route path="qr-load" element={<QrLoad />} />
            <Route path="qr-scan" element={<QrScan />} />
          </Route>

          <Route
            path="*"
            element={<Navigate to={`/${i18n.language}`} replace />}
          />
        </Routes>
      </main>
      <Footer />
      {webConsole && <WebConsole />}
    </div>
  );
}
