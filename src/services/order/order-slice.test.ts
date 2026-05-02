import { expect, test, describe } from '@jest/globals';
import orderSlice, {
  addIngredientToOrder,
  getFeedsThunk,
  getOrderByNumberThunk,
  getOrdersThunk,
  initialState,
  makeOrder,
  moveIngredient,
  orderBurgerThunk,
  removeIngredient,
  resetOrderData
} from '../order/order-slice';

const ingredient = {
  calories: 0,
  carbohydrates: 0,
  fat: 0,
  image: '',
  image_large: '',
  image_mobile: '',
  name: 'Ингредиент',
  price: 0,
  proteins: 0,
  type: 'main',
  _id: '1'
};
const initialOrder = {
  createdAt: '2026-04-15T14:05:30.238Z',
  ingredients: [
    '643d69a5c3f7b9001cfa093d',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa093d'
  ],
  name: 'Флюоресцентный люминесцентный бургер',
  number: 104115,
  status: 'done',
  updatedAt: '2026-04-15T14:05:30.482Z',
  _id: '69df9b2aa64177001b33289e'
};
const initialIngredientsState = {
  ...initialState
};

describe('тесты синхронных экшенов в order.slice', () => {
  test('Добавить ингредиент к заказу', () => {
    const newState = orderSlice(
      initialIngredientsState,
      addIngredientToOrder(ingredient)
    );

    expect(newState.current.ingredients).toHaveLength(1);
    expect(newState.current.ingredients[0]).toEqual(
      expect.objectContaining(ingredient)
    );
    expect(newState.current.ingredients[0]).toHaveProperty('id');
  });

  test('Удалить ингредиент из заказа', () => {
    const stateWithItem = {
      ...initialState,
      current: {
        bun: null,
        ingredients: [{ ...ingredient, id: 'remove-id' }]
      }
    };

    const removeState = orderSlice(
      stateWithItem,
      removeIngredient('remove-id')
    );
    expect(removeState.current.ingredients).toHaveLength(0);
  });

  test('Сделать заказ', () => {
    const historyState = orderSlice(initialState, makeOrder(initialOrder));
    expect(historyState.history.orders).toHaveLength(1);
  });

  test('Изменение порядка ингредиентов', () => {
    const stateWithItems = {
      ...initialState,
      current: {
        bun: null,
        ingredients: [
          { ...ingredient, id: '1', name: 'Ингредиент-1' },
          { ...ingredient, id: '2', name: 'Ингредиент-2' }
        ]
      }
    };

    const newState = orderSlice(
      stateWithItems,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(newState.current.ingredients[0].id).toBe('2');
    expect(newState.current.ingredients[1].id).toBe('1');
  });

  test('Удалить заказ', () => {
    const stateWithOrder = {
      ...initialState,
      orderData: { ...initialOrder }
    };

    const newState = orderSlice(stateWithOrder, resetOrderData());

    expect(newState.orderData).toBe(null);
  });
});

describe('тесты асинхронных экшенов в order.slice', () => {
  test('Состояние orderBurgerThunk.pending при отправке заказа на сервер', () => {
    const action = { type: orderBurgerThunk.pending.type };
    const state = orderSlice(initialIngredientsState, action);
    expect(state.isOrderLoading).toBe(true);
  });
  test('Состояние orderBurgerThunk.fulfilled при отправке заказа на сервер', () => {
    const expectedResult = {
      success: true,
      order: {
        _id: '',
        status: '',
        name: '',
        owner: '',
        createdAt: '',
        updatedAt: '',
        number: '',
        price: ''
      },
      name: ''
    };
    const action = {
      type: orderBurgerThunk.fulfilled.type,
      payload: expectedResult
    };
    const state = orderSlice(initialIngredientsState, action);
    expect(state.isOrderLoading).toBe(false);
    expect(state.orderData).toEqual(
      expect.objectContaining(expectedResult.order)
    );
    expect(state.current.bun).toBe(null);
    expect(state.current.ingredients).toStrictEqual([]);
  });
  test('Состояние orderBurgerThunk.rejected при отправке заказа на сервер', () => {
    const action = { type: orderBurgerThunk.rejected.type };
    const state = orderSlice(initialIngredientsState, action);
    expect(state.isOrderLoading).toBe(false);
  });

  test('Состояние getOrderByNumberThunk.pending получение заказа по номеру', () => {
    const action = { type: getOrderByNumberThunk.pending.type };
    const state = orderSlice(initialIngredientsState, action);
    expect(state.isOrderLoading).toBe(true);
  });
  test('Состояние getOrderByNumberThunk.fulfilled получение заказа по номеру', () => {
    const expectedResult = {
      success: true,
      orders: [
        {
          _id: '1',
          status: 'done',
          name: 'Заказ-1',
          createdAt: '',
          updatedAt: '',
          number: 1,
          ingredients: []
        }
      ]
    };
    const action = {
      type: getOrderByNumberThunk.fulfilled.type,
      payload: expectedResult
    };
    const state = orderSlice(initialIngredientsState, action);
    expect(state.isOrderLoading).toBe(false);
    expect(state.orderByNumber).toEqual(expectedResult.orders[0]);
  });
  test('Состояние getOrderByNumberThunk.rejected получение заказа по номеру', () => {
    const action = { type: getOrderByNumberThunk.rejected.type };
    const state = orderSlice(initialIngredientsState, action);
    expect(state.isOrderLoading).toBe(false);
  });

  test('Состояние getFeedsThunk.pending получение всех заказов', () => {
    const action = { type: getFeedsThunk.pending.type };
    const state = orderSlice(initialIngredientsState, action);
    expect(state.isFeedLoading).toBe(true);
  });
  test('Состояние getFeedsThunk.fulfilled получение всех заказов', () => {
    const expectedResult = {
      orders: [],
      total: 0,
      totalToday: 0
    };
    const action = {
      type: getFeedsThunk.fulfilled.type,
      payload: expectedResult
    };
    const state = orderSlice(initialIngredientsState, action);
    expect(state.isFeedLoading).toBe(false);
    expect(state.feed).toEqual(expectedResult);
  });
  test('Состояние getFeedsThunk.rejected получение всех заказов', () => {
    const action = { type: getFeedsThunk.rejected.type };
    const state = orderSlice(initialIngredientsState, action);
    expect(state.isFeedLoading).toBe(false);
  });

  test('Состояние getOrdersThunk.pending получение всех заказов пользователя', () => {
    const action = { type: getOrdersThunk.pending.type };
    const state = orderSlice(initialIngredientsState, action);
    expect(state.isHistoryLoading).toBe(true);
  });
  test('Состояние getOrdersThunk.fulfilled получение всех заказов пользователя', () => {
    const expectedResult = [{ ...initialOrder }, { ...initialOrder }];
    const action = {
      type: getOrdersThunk.fulfilled.type,
      payload: expectedResult
    };
    const state = orderSlice(initialIngredientsState, action);
    expect(state.isHistoryLoading).toBe(false);
    expect(state.history.orders).toEqual(expectedResult);
  });
  test('Состояние getOrdersThunk.rejected получение всех заказов пользователя', () => {
    const action = { type: getOrdersThunk.rejected.type };
    const state = orderSlice(initialIngredientsState, action);
    expect(state.isHistoryLoading).toBe(false);
  });
});
