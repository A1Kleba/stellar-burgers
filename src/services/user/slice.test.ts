import { expect, test, describe } from '@jest/globals';
import userSlice, {
  initialState,
  setIsInit,
  setIsLoading,
  setUser
} from '../user/user-slice';
import {
  getUserThunk,
  authLogin,
  logoutThunk,
  authRegister,
  updateUserThunk
} from './userThunks';

const initialUserState = { ...initialState };
const user = {
  email: '',
  name: 'User-1'
};
const expectedResult = {
  success: true,
  refreshToken: '',
  accessToken: '',
  user: { ...user }
};

describe('тесты синхронных экшенов в user.slice', () => {
  test('Добавить пользователя', () => {
    const newState = userSlice(initialUserState, setUser(user));
    expect(newState.user).toEqual(expect.objectContaining(user));
  });

  test('Установить isInit', () => {
    const isInit = true;
    const newState = userSlice(initialUserState, setIsInit(isInit));
    expect(newState.isInit).toBe(isInit);
  });

  test('Установить isLoading', () => {
    const isLoading = true;
    const newState = userSlice(initialUserState, setIsLoading(isLoading));
    expect(newState.isLoading).toBe(isLoading);
  });
});

const testPending = (thunk: any, description: string) => {
  test(`Состояние ${description}.pending`, () => {
    const action = { type: thunk.pending.type };
    const state = userSlice(initialUserState, action);
    expect(state.isLoading).toBe(true);
  });
};

const testFulfilled = (
  thunk: any,
  description: string,
  expectedPayload: any
) => {
  test(`Состояние ${description}.fulfilled`, () => {
    const action = {
      type: thunk.fulfilled.type,
      payload: expectedPayload
    };
    const state = userSlice(initialUserState, action);

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(expectedPayload.user);
    if (description !== 'logoutThunk') {
      expect(state.isInit).toBe(true);
    }
  });
};

const testRejected = (thunk: any, description: string) => {
  test(`Состояние ${description}.rejected`, () => {
    const action = { type: thunk.rejected.type };
    const state = userSlice(initialUserState, action);
    expect(state.isLoading).toBe(false);
  });
};

describe('тесты асинхронных экшенов в user.slice', () => {
  testPending(authLogin, 'loginUserThunk');
  testFulfilled(authLogin, 'loginUserThunk', expectedResult);
  testRejected(authLogin, 'loginUserThunk');

  testPending(authRegister, 'registerUserThunk');
  testFulfilled(authRegister, 'registerUserThunk', expectedResult);
  testRejected(authRegister, 'registerUserThunk');

  testPending(getUserThunk, 'getUserThunk');
  testFulfilled(getUserThunk, 'getUserThunk', expectedResult);
  testRejected(getUserThunk, 'getUserThunk');

  testPending(logoutThunk, 'logoutThunk');
  test('Состояние logoutThunk.fulfilled', () => {
    const action = { type: logoutThunk.fulfilled.type };
    const state = userSlice(initialUserState, action);
    expect(state.isLoading).toBe(false);
    expect(state.isInit).toBe(false);
    expect(state.user).toBeNull();
    expect(state.isAuth).toBe(false);
  });
  testRejected(logoutThunk, 'logoutThunk');

  testPending(updateUserThunk, 'updateUserThunk');
  test('Состояние updateUserThunk.fulfilled', () => {
    const expectedResponse = {
      success: true,
      user: { ...user }
    };
    const action = {
      type: updateUserThunk.fulfilled.type,
      payload: expectedResponse
    };
    const state = userSlice(initialUserState, action);
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(expectedResponse.user);
  });
  testRejected(updateUserThunk, 'updateUserThunk');
});
