import { getFetch } from './fetch';

export const checkUser = async () => {
  let data = await getFetch('/user/account', {
    headers: {
      contentType: 'application/json',
    },
  });

  return data;
};
