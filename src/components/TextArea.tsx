import { useRef } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

interface TextArea {
  className?: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
  readOnly?: boolean;
  hideLength?: boolean;
}

export function TextArea({
  className = clsx(
    'dark:bg-gray-700 dark:text-white',
    'focus:outline-none focus:ring-2 focus:ring-yellow-500'
  ),
  value,
  onChange = () => {},
  placeholder = '',
  maxLength = 0,
  rows = 4,
  readOnly = false,
  hideLength = false,
}: TextArea) {
  const { t } = useTranslation();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="w-full relative">
      <textarea
        ref={textAreaRef}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        {...(maxLength && maxLength > 0 ? { maxLength } : {})}
        rows={rows}
        className={clsx(
          'w-full p-3 resize-none',
          'border rounded-xl shadow-md',
          className
        )}
      />

      <div className="mt-1 pr-2 flex justify-end items-center gap-4 text-sm">
        {!hideLength && (
          <span className="text-gray-600 dark:text-gray-300">
            {maxLength > 0
              ? `( ${value.length} / ${maxLength} )`
              : `( ${value.length} )`}
          </span>
        )}

        {!readOnly && (
          <AnimatePresence>
            {value.length > 0 && (
              <motion.button
                title={t('global.delete')}
                type="button"
                key="delete"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.3 }}
                onClick={() => {
                  onChange('');
                  textAreaRef.current?.focus();
                }}
                className={clsx(
                  'p-1 rounded-lg',
                  'bg-red-500 hover:bg-red-600',
                  'flex items-center justify-center'
                )}
              >
                <XMarkIcon className="w-4 h-4 text-white" />
              </motion.button>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
