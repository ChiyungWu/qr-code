import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { QrCodeIcon, PhotoIcon, CameraIcon } from '@heroicons/react/24/outline';

export function MainPage() {
  const { urlLang } = useParams();
  const { t } = useTranslation();

  const LIST_QrMode = [
    {
      key: 'qr-make',
      label: t('QR-Make-Name'),
      explain: t('QR-Make-Desc'),
      icon: QrCodeIcon,
    },
    {
      key: 'qr-load',
      label: t('QR-Load-Name'),
      explain: t('QR-Load-Desc'),
      icon: PhotoIcon,
    },
    {
      key: 'qr-scan',
      label: t('QR-Scan-Name'),
      explain: t('QR-Scan-Desc'),
      icon: CameraIcon,
    },
  ];

  useEffect(() => {
    document.title = t('QR-Code-Name');
  }, [t]);

  return (
    <div className="flex-1 p-8 flex flex-col items-center">
      <h1 className="text-xl mb-8">{t('pleaseClickFunction')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {LIST_QrMode.map((mode, index) => {
          const Icon = mode.icon;
          return (
            <motion.div
              key={mode.key}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.3 }}
              className="h-full"
            >
              <Link
                to={`/${urlLang}/${mode.key}`}
                className={clsx(
                  'group',
                  'h-full p-6',
                  'flex flex-col justify-start',
                  'border rounded-xl shadow-md',
                  'hover:bg-yellow-500 hover:text-black'
                )}
              >
                <div className="flex items-center mb-4">
                  <Icon className="w-6 h-6 mr-4" />
                  <h2 className="text-lg group-hover:font-bold">
                    {mode.label}
                  </h2>
                </div>
                <hr className="border-t border-gray-300 my-2 group-hover:border-black" />
                <p className="mt-4 break-words">{mode.explain}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
