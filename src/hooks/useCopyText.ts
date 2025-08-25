import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useCallback } from 'react';

export function useCopyText() {
  const { t } = useTranslation();

  const msgOK = t('global.copyok');
  const msgNG = t('global.copyng');

  const copyText = useCallback(
    async (workText: string) => {
      if (!workText) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(workText);
          toast.success(msgOK);
        } catch {
          fallbackCopy(workText, msgOK, msgNG);
        }
      } else {
        fallbackCopy(workText, msgOK, msgNG);
      }
    },
    [msgNG, msgOK]
  );

  return copyText;
}

function fallbackCopy(workText: string, msgOK: string, msgNG: string) {
  const textarea = document.createElement('textarea');
  textarea.value = workText;
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand('copy');
    toast.success(msgOK);
  } catch {
    toast.error(msgNG);
  }
  document.body.removeChild(textarea);
}
