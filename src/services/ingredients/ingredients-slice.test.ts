import { expect, test, describe } from '@jest/globals';
import {
  ingredientsSlice,
  getIngredients
} from '../ingredients/ingredients-slice';
import { TIngredient } from '@utils-types';

const { reducer } = ingredientsSlice;
const initialState = ingredientsSlice.getInitialState();

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Ингредиент-1',
    type: 'main',
    calories: 100,
    carbohydrates: 10,
    fat: 5,
    image: '',
    image_large: '',
    image_mobile: '',
    price: 50,
    proteins: 20
  },
  {
    _id: '2',
    name: 'Ингредиент-2',
    type: 'sauce',
    calories: 80,
    carbohydrates: 5,
    fat: 3,
    image: '',
    image_large: '',
    image_mobile: '',
    price: 30,
    proteins: 15
  }
];

describe('тесты редьюсера ingredientsSlice', () => {
  describe('обработка экшена getIngredients.pending', () => {
    test('при вызове pending isLoading меняется на true', () => {
      const action = { type: getIngredients.pending.type };
      const newState = reducer(initialState, action);

      expect(newState.isLoading).toBe(true);
      expect(newState.ingredients).toHaveLength(0);
    });
  });

  describe('обработка экшена getIngredients.fulfilled', () => {
    test('при успешном выполнении данные записываются в стор и isLoading меняется на false', () => {
      const action = {
        type: getIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const newState = reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.ingredients).toHaveLength(2);
      expect(newState.ingredients).toEqual(mockIngredients);
      expect(newState.ingredients[0].name).toBe('Ингредиент-1');
      expect(newState.ingredients[1].name).toBe('Ингредиент-2');
    });
  });

  describe('обработка экшена getIngredients.rejected', () => {
    test('при ошибке isLoading меняется на false (данные не меняются)', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: mockIngredients,
        isLoading: true
      };

      const action = { type: getIngredients.rejected.type };
      const newState = reducer(stateWithIngredients, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.ingredients).toEqual(mockIngredients);
      expect(newState.ingredients).toHaveLength(2);
    });

    test('при ошибке в пустом состоянии isLoading меняется на false', () => {
      const action = { type: getIngredients.rejected.type };
      const newState = reducer(initialState, action);

      expect(newState.isLoading).toBe(false);
      expect(newState.ingredients).toHaveLength(0);
    });
  });
});
