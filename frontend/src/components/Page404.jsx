import React from 'react';
import { useTranslation } from 'react-i18next';

const Page404 = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center p-4">
      <h1 className="h4 text-muted">
        {t('page404.header')}
      </h1>
      <p className="text-muted">
        {t('page404.message')}
        <a href="/">{t('page404.linkText')}</a>
      </p>
    </div>
  );
};

export default Page404;
