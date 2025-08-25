import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  PhotoIcon,
  ArrowPathIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import QrScanner from 'qr-scanner';
import { QrHeader } from '@/components/QrHeader';
import { QrResult } from '@/components/QrResult';

export default function QrLoad() {
  const { t } = useTranslation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showLoading, setShowLoading] = useState(false);
  const [showImage, setShowImage] = useState<string | null>(null);
  const [showFileName, setShowFileName] = useState('');
  const [showError, setShowError] = useState('');
  const [showResult, setShowResult] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const parserImage = async (file: File) => {
    setShowLoading(true);

    try {
      setShowError('');
      const qrResult = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true,
      });
      setShowResult(qrResult.data);
    } catch {
      setShowError(t('errorNotQrCode'));
    }
    setShowLoading(false);
  };

  const handleFileUploaded = async (file: File | null) => {
    if (!file) return;
    setShowFileName(file.name);
    setShowResult('');

    if (!file.type.startsWith('image/')) {
      setShowImage(null);
      setShowError(t('errorNotImage'));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setShowImage(URL.createObjectURL(file));
    await parserImage(file);
  };

  const handleFileBrowser = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleFileUploaded(file);
  };

  const handleFileDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    const file = event.dataTransfer.files[0] || null;
    handleFileUploaded(file);
  };

  const eventResetLoad = () => {
    setShowImage(null);
    setShowFileName('');
    setShowError('');
    setShowResult('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex-1 p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        <QrHeader name={t('QR-Load-Name')} desc={t('QR-Load-Desc')} />
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFileDrop(e);
          }}
          onKeyDown={(e) => {
            if (!showLoading && (e.key === 'Enter' || e.key === ' ')) {
              fileInputRef.current?.click();
            }
          }}
          tabIndex={0}
          className={clsx(
            'w-full p-6 cursor-pointer',
            'rounded-xl border-4 border-dashed',
            'flex flex-col items-center justify-center',
            'hover:bg-gray-200 dark:hover:bg-gray-800',
            { 'opacity-50 pointer-events-none': showLoading },
            isDragging
              ? 'bg-blue-100 dark:bg-blue-700 border-blue-400'
              : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
          )}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileBrowser}
            ref={fileInputRef}
            disabled={showLoading}
          />

          {!showImage ? (
            <PhotoIcon className="w-40 h-40 text-gray-400" />
          ) : (
            <img
              src={showImage}
              alt={t('viewUploadImage')}
              className="object-contain shadow-md max-h-96"
            />
          )}

          {!showFileName ? (
            <div className="pb-4">{t('askUploadImage')}</div>
          ) : (
            <div className="w-full text-center">
              <hr className="w-full mt-6 mb-4 border border-2 border-gray-300 dark:border-gray-600" />
              <div className="font-bold">{t('uploadedFileName')}</div>
              <div className="font-bold italic">( {showFileName} )</div>
            </div>
          )}
        </label>
        {showError && (
          <div className="w-full">
            <div className="pl-4 flex items-center justify-start gap-4">
              <button
                onClick={eventResetLoad}
                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                title={t('global.reset')}
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <span
                onClick={eventResetLoad}
                className="hover:underline cursor-pointer"
              >
                {showError}
              </span>
            </div>
          </div>
        )}
        {showLoading && (
          <div className="p-6 flex flex-col items-center justify-center text-yellow-500 space-y-8">
            <ArrowPathIcon className="h-16 w-16 animate-spin" />
            <div>{t('analyzing...')}</div>
          </div>
        )}
        {showResult && (
          <QrResult qrResult={showResult} t={t} onResetLoad={eventResetLoad} />
        )}
      </div>
    </div>
  );
}
