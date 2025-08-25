import i18n from '@/i18n';
import { toast } from 'react-hot-toast';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { type TYPE_Lang } from '@/config/TYPE_Lang';
import { switchLocale } from '@/utils/switchLocale';

export function useSwitchLang() {
  const { t } = useTranslation();
  const [webLang, setWebLang] = useState(i18n.language);

  return useCallback(
    async (nextLang: TYPE_Lang) => {
      if (nextLang !== webLang) {
        setWebLang(nextLang);
        await switchLocale(nextLang);
        toast.success(t('toast.languageUpdated'));
      }
    },
    [t, webLang]
  );
}
