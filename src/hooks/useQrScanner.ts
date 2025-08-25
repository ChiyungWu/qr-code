import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';

export interface Ifi_UseQrScanner {
  t: (key: string) => string;
  setCameraError: (value: string | null) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  cameraId: string | null;
  cameraList: MediaDeviceInfo[];
  setScanResult: (value: string | null) => void;
}

export interface Ifo_UseQrScanner {
  lastFrame: string | null;
  setLastFrame: (value: string | null) => void;
  initScanner: () => void;
}

export function useQrScanner({
  t,
  setCameraError,
  videoRef,
  cameraId,
  cameraList,
  setScanResult,
}: Ifi_UseQrScanner): Ifo_UseQrScanner {
  const scannerRef = useRef<QrScanner | null>(null);
  const [lastFrame, setLastFrame] = useState<string | null>(null);

  const freezeFrame = (videoBox: HTMLVideoElement): string | null => {
    const canvas = document.createElement('canvas');
    canvas.width = videoBox.videoWidth;
    canvas.height = videoBox.videoHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) return null;

    ctx.drawImage(videoBox, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  };

  const waitDestroyed = async () => {
    if (!scannerRef.current) return;
    const $video = scannerRef.current.$video;
    const stream = $video?.srcObject;
    let tracks: MediaStreamTrack[] = [];

    if (stream && stream instanceof MediaStream) {
      tracks = stream.getTracks();
    }

    await new Promise<void>((resolve) => {
      const checkTracks = () => {
        if (
          tracks.every((t) => t.readyState === 'ended') &&
          !$video?.srcObject
        ) {
          resolve();
        } else {
          setTimeout(checkTracks, 50);
        }
      };
      checkTracks();
    });

    scannerRef.current = null;
  };

  const initScanner = async () => {
    const videoBox = videoRef.current;
    if (!videoBox || !cameraId || cameraList.length === 0) return;

    if (scannerRef.current) {
      await waitDestroyed();
    }

    const scanner = new QrScanner(
      videoBox,
      (qrResult) => {
        setScanResult(qrResult.data);

        const snapshot = freezeFrame(videoBox);
        if (snapshot) {
          setLastFrame(snapshot);
        }

        scanner.destroy();
      },
      {
        preferredCamera: cameraId,
        highlightScanRegion: true,
        returnDetailedScanResult: true,
      }
    );

    scannerRef.current = scanner;

    try {
      await scanner.start();
    } catch {
      setCameraError(t('cameraNotStart'));
    }
  };

  useEffect(() => {
    initScanner();
    return () => {
      if (scannerRef.current) scannerRef.current.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraId]);

  return { lastFrame, setLastFrame, initScanner };
}
