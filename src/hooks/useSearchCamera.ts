import { useState, useEffect } from 'react';

export interface Ifi_UseSearchCamera {
  t: (key: string) => string;
  setCameraError: (err: string) => void;
}

export interface Ifo_UseSearchCamera {
  cameraList: MediaDeviceInfo[];
  cameraId: string | null;
  setCameraId: (id: string) => void;
}

export function useSearchCamera({
  t, setCameraError,
}: Ifi_UseSearchCamera): Ifo_UseSearchCamera {
  const [cameraId, setCameraId] = useState<string | null>(null);
  const [cameraList, setCameraList] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const searchCamera = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setCameraError(t('deviceAPINotSupported'));
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = allDevices.filter((d) => d.kind === 'videoinput');
        setCameraList(videoInputs);

        if (videoInputs.length > 0) {
          const backCam = videoInputs.find((dev) => {
            const label = dev.label.toLowerCase();
            return (
              label.includes('back') ||
              label.includes('rear') ||
              label.includes('environment')
            );
          });
          setCameraId(backCam ? backCam.deviceId : videoInputs[0].deviceId);
        }

        stream.getTracks().forEach((track) => track.stop());
      } catch (er) {
        const err = er as Error;
        switch (err.name) {
          case 'NotAllowedError':
            setCameraError(t('cameraNotAllowed'));
            break;
          case 'NotFoundError':
            setCameraError(t('cameraNotFound'));
            break;
          default:
            setCameraError(t('cameraUnknownError'));
            break;
        }
      }
    };

    searchCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    cameraList,
    cameraId,
    setCameraId,
  };
}
