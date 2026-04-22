import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TUser } from './types';

const URL = process.env.BURGER_API_URL;

const ENDPOINTS = {
  INGREDIENTS: `${URL}/ingredients`,
  FEEDS: `${URL}/orders/all`,
  ORDERS: `${URL}/orders`,
  ORDER_BY_NUMBER: (number: number) => `${URL}/orders/${number}`,
  AUTH_REGISTER: `${URL}/auth/register`,
  AUTH_LOGIN: `${URL}/auth/login`,
  AUTH_LOGOUT: `${URL}/auth/logout`,
  AUTH_TOKEN: `${URL}/auth/token`,
  PASSWORD_RESET: `${URL}/password-reset`,
  PASSWORD_RESET_CONFIRM: `${URL}/password-reset/reset`,
  USER: `${URL}/auth/user`
} as const;

const HEADERS = {
  JSON: { 'Content-Type': 'application/json;charset=utf-8' },
  AUTHORIZED: (token: string) => ({
    'Content-Type': 'application/json;charset=utf-8',
    authorization: token
  })
} as const;

const checkResponse = <T>(res: Response): Promise<T> => {
  if (res.ok) {
    return res.json();
  }
  return res.json().then((err) => {
    throw {
      status: res.status,
      message: err.message || 'Unknown error',
      ...err
    };
  });
};

type TServerResponse<T> = { success: boolean } & T;

type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(ENDPOINTS.AUTH_TOKEN, {
    method: 'POST',
    headers: HEADERS.JSON,
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        throw refreshData;
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken, { expires: 60 * 60 });
      return refreshData;
    });

export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
): Promise<T> => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if ((err as { message: string }).message.includes('jwt expired')) {
      const refreshData = await refreshToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      }
      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    } else {
      throw err;
    }
  }
};

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

export const getIngredientsApi = () =>
  fetch(ENDPOINTS.INGREDIENTS)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data.success) return data.data;
      throw data;
    });

export const getFeedsApi = () =>
  fetch(ENDPOINTS.FEEDS)
    .then((res) => checkResponse<TFeedsResponse>(res))
    .then((data) => {
      if (data.success) return data;
      throw data;
    });

export const getOrdersApi = () =>
  fetchWithRefresh<TFeedsResponse>(ENDPOINTS.ORDERS, {
    method: 'GET',
    headers: HEADERS.AUTHORIZED(getCookie('accessToken') || '')
  }).then((data) => {
    if (data.success) return data.orders;
    throw data;
  });

type TOwner = {
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type TNewOrder = {
  _id: string;
  status: string;
  name: string;
  owner: TOwner;
  createdAt: string;
  updatedAt: string;
  number: number;
  price: number;
};

type TNewOrderResponse = TServerResponse<{
  order: TNewOrder;
  name: string;
}>;

export const orderBurgerApi = (data: string[]) =>
  fetchWithRefresh<TNewOrderResponse>(ENDPOINTS.ORDERS, {
    method: 'POST',
    headers: HEADERS.AUTHORIZED(getCookie('accessToken') || ''),
    body: JSON.stringify({
      ingredients: data
    })
  }).then((data) => {
    if (data.success) return data;
    throw data;
  });

type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

export const getOrderByNumberApi = (number: number) =>
  fetch(ENDPOINTS.ORDER_BY_NUMBER(number), {
    method: 'GET',
    headers: HEADERS.JSON
  }).then((res) => checkResponse<TOrderResponse>(res));

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

export const registerUserApi = (data: TRegisterData) =>
  fetch(ENDPOINTS.AUTH_REGISTER, {
    method: 'POST',
    headers: HEADERS.JSON,
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data.success) return data;
      throw data;
    });

export type TLoginData = {
  email: string;
  password: string;
};

export const loginUserApi = (data: TLoginData) =>
  fetch(ENDPOINTS.AUTH_LOGIN, {
    method: 'POST',
    headers: HEADERS.JSON,
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data.success) {
        localStorage.setItem('refreshToken', data.refreshToken);
        setCookie('accessToken', data.accessToken, { expires: 60 * 60 });
        return data;
      }
      throw data;
    });

export const forgotPasswordApi = (data: { email: string }) =>
  fetch(ENDPOINTS.PASSWORD_RESET, {
    method: 'POST',
    headers: HEADERS.JSON,
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data.success) return data;
      throw data;
    });

export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(ENDPOINTS.PASSWORD_RESET_CONFIRM, {
    method: 'POST',
    headers: HEADERS.JSON,
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data.success) return data;
      throw data;
    });

type TUserResponse = TServerResponse<{ user: TUser }>;

export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>(ENDPOINTS.USER, {
    headers: HEADERS.AUTHORIZED(getCookie('accessToken') || '')
  });

export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh<TUserResponse>(ENDPOINTS.USER, {
    method: 'PATCH',
    headers: HEADERS.AUTHORIZED(getCookie('accessToken') || ''),
    body: JSON.stringify(user)
  });

export const logoutApi = () =>
  fetch(ENDPOINTS.AUTH_LOGOUT, {
    method: 'POST',
    headers: HEADERS.JSON,
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((res) => checkResponse<TServerResponse<{}>>(res));
