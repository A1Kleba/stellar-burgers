import ingredientsSlice from './ingredients/ingredients-slice';
import orderSlice from './order/order-slice';
import { rootReducer } from './store';
import userSlice from './user/user-slice';

describe('rootReducer', () => {
  it('проверяем правильную настройку и работу rootReducer', () => {
    const fakeAction = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, fakeAction);

    expect(state).toEqual({
      user: userSlice(undefined, fakeAction),
      ingredients: ingredientsSlice(undefined, fakeAction),
      order: orderSlice(undefined, fakeAction)
    });
  });
});
