import { getUserApi, loginUserApi, logoutApi, registerUserApi, TLoginData, TRegisterData, updateUserApi } from '@api';
import { setCookie, deleteCookie, } from '../../utils/cookie';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const authLogin = createAsyncThunk('user/loginUser', async ({ email, password }: TLoginData) => {
    const userData = await loginUserApi({ email, password });
    setCookie('accessToken', userData.accessToken);
    localStorage.setItem('refreshToken', userData.refreshToken);
    return userData;
  });

export const authRegister = createAsyncThunk('user/registerUser', async ({ email, name, password }: TRegisterData) => {
    const userData = await registerUserApi({ email, name, password });
    setCookie('accessToken', userData.accessToken);
    localStorage.setItem('refreshToken', userData.refreshToken);
    return userData;
  });

export const getUserThunk = createAsyncThunk('user/getUser', () => getUserApi());

export const logoutThunk = createAsyncThunk('user/logoutUser', () => {
  logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const updateUserThunk = createAsyncThunk('user/updateUser',updateUserApi);