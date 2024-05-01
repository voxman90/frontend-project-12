/* eslint import/prefer-default-export: 0 */

import { toast } from 'react-toastify';

const handleAxiosErrors = (error, t, handleStatus = () => false) => {
  if (error.response) {
    const { status } = error.response;

    console.error(error.response.data);
    console.error(error.response.status);
    console.error(error.response.headers);

    if (handleStatus(status)) {
      return;
    }

    toast.error(t('errors.network'));
    return;
  }

  if (error.request) {
    console.error(error.request);

    toast.error(t('errors.network'));
    return;
  }

  console.error(error);

  toast.error(t('errors.unknown'));
};

export { handleAxiosErrors };
