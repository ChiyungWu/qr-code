import { useState } from 'react';
import { Link } from 'react-router-dom';

import clsx from 'clsx';
import { SunIcon, MoonIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

import { WebLangMenu } from '@/components/modal/WebLangMenu';
import { MENU_HEIGHT } from '@/constants/getMenuHeight';
import { useSwitchTheme } from '@/hooks/useSwitchTheme';
import i18n from '@/i18n';

export function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { webTheme, toggleWebTheme } = useSwitchTheme();

  const LogoClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length < 2) {
      event.preventDefault();
      return;
    }
  };

  return (
    <>
      <nav
        className={clsx(
          'sticky top-0 z-10',
          'bg-blue-600 text-white shadow-lg'
        )}
        style={{ height: `${MENU_HEIGHT}px` }}
      >
        <div
          className={clsx(
            'mx-auto max-w-[1024px] h-full',
            'px-6 py-3',
            'flex items-center justify-between'
          )}
        >
          <Link to={`/${i18n.language}`} onClick={LogoClick}>
            <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          </Link>

          <div className="flex items-center space-x-8">
            <button
              aria-label="Switch theme"
              onClick={toggleWebTheme}
              className={clsx('w-8 h-8', 'hover:bg-white hover:text-blue-600')}
            >
              {webTheme === 'dark' ? <MoonIcon /> : <SunIcon />}
            </button>

            <button
              aria-label="Language Menu"
              onClick={() => setIsModalOpen(true)}
              className={clsx('w-8 h-8', 'hover:bg-white hover:text-blue-600')}
            >
              <GlobeAltIcon />
            </button>
          </div>
        </div>
      </nav>

      <WebLangMenu
        isModalOpen={isModalOpen}
        onCloseModal={() => setIsModalOpen(false)}
      />
    </>
  );
}
