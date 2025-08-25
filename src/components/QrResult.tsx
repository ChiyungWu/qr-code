import { type FC } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentDuplicateIcon,
  LinkIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useCopyText } from '@/hooks/useCopyText';
import { isValidHttpUrl } from '@/utils/isValidHttpUrl';

interface If_QrResult {
  qrResult: string;
  t: (key: string) => string;
  onResetLoad?: () => void;
  onResetScan?: () => void;
}

export const QrResult: FC<If_QrResult> = ({
  qrResult,
  t,
  onResetLoad,
  onResetScan,
}) => {
  const copyText = useCopyText();
  const isLink = isValidHttpUrl(qrResult);

  return (
    <motion.div
      className="w-full flex flex-col space-y-4"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      {isLink ? (
        <input
          className={clsx(
            'w-full p-2 rounded-lg cursor-not-allowed',
            'bg-green-100 text-green-800 border-2 border-green-500'
          )}
          value={qrResult}
          readOnly
        />
      ) : (
        <textarea
          className={clsx(
            'w-full p-2 rounded-lg cursor-not-allowed',
            'bg-green-100 text-green-800 border-2 border-green-500'
          )}
          value={qrResult}
          rows={2}
          readOnly
        />
      )}

      <div className="pl-4 flex flex-col space-y-4">
        {isLink && (
          <div className="flex items-center justify-start gap-4">
            <a
              href={qrResult}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg"
              title={t('global.link')}
            >
              <LinkIcon className="w-6 h-6" />
            </a>
            <a
              href={qrResult}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline cursor-pointer"
              tabIndex={-1}
            >
              {t('click2Visit')}
            </a>
          </div>
        )}

        <div className="flex items-center justify-start gap-4">
          <button
            onClick={() => copyText(qrResult)}
            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            title={t('global.copy')}
          >
            <DocumentDuplicateIcon className="w-6 h-6" />
          </button>
          <span
            onClick={() => copyText(qrResult)}
            className="hover:underline cursor-pointer"
          >
            {t('copyResult')}
          </span>
        </div>

        {onResetLoad && (
          <div className="flex items-center justify-start gap-4">
            <button
              onClick={onResetLoad}
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              title={t('global.reset')}
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
            <span
              onClick={onResetLoad}
              className="hover:underline cursor-pointer"
            >
              {t('resetLoad')}
            </span>
          </div>
        )}
        {onResetScan && (
          <div className="flex items-center justify-start gap-4">
            <button
              onClick={onResetScan}
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              title={t('global.reset')}
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
            <span
              onClick={onResetScan}
              className="hover:underline cursor-pointer"
            >
              {t('resetScan')}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
