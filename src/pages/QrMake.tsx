import { toast } from 'react-hot-toast';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeCanvas } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownTrayIcon, ShareIcon } from '@heroicons/react/24/outline';
import { QrHeader } from '@/components/QrHeader';
import { TextArea } from '@/components/TextArea';
import { encryptXor, decryptXor } from '@/utils/cryptoXor';

export default function QrMake() {
  const { t, i18n } = useTranslation();
  const [qrText, setQrText] = useState('');
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [qrSize, setQrSize] = useState(240);

  const [readOnly, setReadOnly] = useState(false);
  const [urlParamed, setUrlParamed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setReadOnly(params.has('readOnly'));

    let nextText = '';

    const codeParam = params.get('code');
    const textParam = params.get('text');

    if (codeParam) {
      try {
        nextText = decryptXor(codeParam);
      } catch {
        nextText = '';
      }
    } else if (textParam) {
      nextText = textParam;
    }

    setQrText(nextText);
    setUrlParamed(true);
  }, []);

  // --- 動態更新網址 ---
  useEffect(() => {
    if (urlParamed && !readOnly) {
      const lang = i18n.language;
      const newUrl =
        qrText === ''
          ? `/${lang}/qr-make`
          : `/${lang}/qr-make?text=${encodeURIComponent(qrText)}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [qrText, readOnly, i18n.language, urlParamed]);

  // --- 更新 QR 大小 ---
  useEffect(() => {
    const updateSize = () => {
      if (qrRef.current) {
        const fullWidth = 464;
        const viewWidth = Math.floor((window.innerWidth * 0.66) / 4) * 4;
        let makeWidth = qrRef.current.offsetWidth;
        if (makeWidth > fullWidth) makeWidth = fullWidth;
        if (makeWidth > viewWidth) makeWidth = viewWidth;
        setQrSize(makeWidth);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    const observer = new ResizeObserver(updateSize);
    if (qrRef.current) observer.observe(qrRef.current);
    return () => {
      window.removeEventListener('resize', updateSize);
      observer.disconnect();
    };
  }, []);

  const eventDownload = () => {
    if (!qrCanvasRef.current) return;

    const qrCanvas = qrCanvasRef.current;
    const qrSize = qrCanvas.width;
    const border = 8;

    const dlCanvas = document.createElement('canvas');
    dlCanvas.width = qrSize + border * 2;
    dlCanvas.height = qrSize + border * 2;

    const ctx = dlCanvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, dlCanvas.width, dlCanvas.height);
    ctx.drawImage(qrCanvas, border, border, qrSize, qrSize);

    const url = dlCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qrcode.png';
    link.click();
  };

  const eventShare = async () => {
    const host = window.location.origin;
    const lang = i18n.language;
    const encodedText = encryptXor(qrText);
    const shareUrl = `${host}/${lang}/qr-make?readOnly&code=${encodedText}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'QR-Code', url: shareUrl });
      } catch {
        //
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success(t('global.shareCopied'));
    }
  };

  return (
    <div className="flex-1 p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        {!readOnly && (
          <QrHeader name={t('QR-Make-Name')} desc={t('QR-Make-Desc')} />
        )}

        {!readOnly && (
          <TextArea
            value={qrText}
            onChange={setQrText}
            placeholder={t('enterText...')}
            maxLength={1024}
            rows={4}
          />
        )}

        <div ref={qrRef} className="invisible w-full h-0" />

        <AnimatePresence>
          {qrText !== '' && !readOnly && (
            <motion.hr
              className="border-t border-black dark:border-white"
              initial={{ opacity: 0, x: '-100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            />
          )}

          {qrText !== '' && (
            <motion.div
              key="qrcode-box"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="p-6 flex flex-col items-center w-full"
            >
              <div className="border-8 border-gray-100 dark:border-white shadow-md cursor-pointer">
                <QRCodeCanvas
                  onClick={eventDownload}
                  ref={qrCanvasRef}
                  value={qrText}
                  size={qrSize}
                />
              </div>

              <div className="mt-4 flex gap-4">
                <motion.button
                  onClick={eventDownload}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  title={t('global.download')}
                  initial={{ opacity: 0, y: 300 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3, ease: 'easeOut' }}
                >
                  <ArrowDownTrayIcon className="w-6 h-6" />
                </motion.button>

                {!readOnly && (
                  <motion.button
                    onClick={eventShare}
                    className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                    title={t('global.share')}
                    initial={{ opacity: 0, y: 300 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.3,
                      duration: 0.3,
                      ease: 'easeOut',
                    }}
                  >
                    <ShareIcon className="w-6 h-6" />
                  </motion.button>
                )}
              </div>

              {readOnly && (
                <div className="mt-4 p-4 border-2 border-red-500 bg-red-100 text-red-700 rounded-lg text-sm">
                  <strong>{t('riskWarning-t')}</strong>
                  <p>{t('riskWarning-1')}</p>
                  <p>{t('riskWarning-2')}</p>
                  <p>{t('riskWarning-3')}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
