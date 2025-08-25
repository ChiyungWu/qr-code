import clsx from 'clsx';

import { FOOT_HEIGHT } from '@/constants/getFootHeight';

export function Footer() {
  return (
    <footer
      className={clsx(
        'bottom-0 z-10',
        'bg-blue-600 text-white shadow-lg',
        'px-4 py-2',
        'flex flex-col items-center justify-center'
      )}
      style={{ height: `${FOOT_HEIGHT}px` }}
    >
      © {new Date().getFullYear()} ByKeon.com
    </footer>
  );
}
