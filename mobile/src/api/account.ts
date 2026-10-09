import {getJson} from './client';

type Account = {
  id: number;
  name: string;
};

export const getMyName = async (): Promise<string> => {
  const account = await getJson<Account>('/account');
  return account.name;
};
