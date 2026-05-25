import { useCallback } from 'react';

import { useAuth } from '@/src/context/AuthContext';
import { fallbackLanguage, TranslationKey, translate } from '@/src/i18n/translations';

export const useTranslation = () => {
  const { language } = useAuth();

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) =>
      translate(key, language ?? fallbackLanguage, vars),
    [language],
  );

  return { t, language };
};
