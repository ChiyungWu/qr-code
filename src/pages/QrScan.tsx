import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { QrHeader } from '@/components/QrHeader';
import { QrResult } from '@/components/QrResult';
import { useQrScanner } from '@/hooks/useQrScanner';
import { useSearchCamera } from '@/hooks/useSearchCamera';

export default function QrScan() {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [rescanning, setRescanning] = useState(false);

  const { cameraList, cameraId, setCameraId } = useSearchCamera({
    t,
    setCameraError,
  });

  const { lastFrame, setLastFrame, initScanner } = useQrScanner({
    t,
    setCameraError,
    videoRef,
    cameraId,
    cameraList,
    setScanResult,
  });

  useEffect(() => {
    if (videoRef.current && cameraId && rescanning) {
      initScanner();
      setRescanning(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rescanning]);

  return (
    <div className="flex-1 p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-8">
        <QrHeader name={t('QR-Scan-Name')} desc={t('QR-Scan-Desc')} />

        {cameraError ? (
          <div
            className={clsx(
              'p-4 space-y-2 font-bold text-lg text-center',
              'bg-red-100 text-red-700 border-2 border-red-500 rounded-lg'
            )}
          >
            <div>{cameraError}</div>
            <div>{t('QR-Scan-Fail')}</div>
          </div>
        ) : (
          <div className="p-2 space-y-4">
            {cameraList.length > 1 && (
              <div>
                <p className="mb-2">{t('detectedCamera')}</p>
                <ul className="space-y-1">
                  {cameraList.map((dev, idx) => (
                    <li key={dev.deviceId}>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value={dev.deviceId}
                          checked={cameraId === dev.deviceId}
                          onChange={() => {
                            setLastFrame(null);
                            setScanResult(null);
                            setCameraId(dev.deviceId);
                          }}
                        />
                        {dev.label || `Camera ${idx + 1}`}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 flex justify-center items-center">
              {lastFrame ? (
                <img
                  src={lastFrame}
                  alt="QR Snapshot"
                  className="max-h-96 aspect-square rounded-lg border-2 object-cover"
                />
              ) : (
                <video
                  ref={videoRef}
                  className="max-h-96 aspect-square rounded-lg border-2 object-cover"
                  autoPlay
                  playsInline
                />
              )}
            </div>

            {scanResult && (
              <QrResult
                qrResult={scanResult}
                t={t}
                onResetScan={() => {
                  setLastFrame(null);
                  setScanResult(null);
                  setRescanning(true);
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
