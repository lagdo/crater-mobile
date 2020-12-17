import {
    SET_CREATE_EXPENSE_CATEGORIES,
    SET_EDI_EXPENSE_CATEGORIES,
    SET_REMOVE_EXPENSE_CATEGORIES,
    SET_EXPENSE_CATEGORIES,
} from '../constants';
import { saveCategories, saveCategory, deleteCategory } from '~/selectors/schemas';

const initialState = {
    categories: [],
};

export default function settingReducer(state = initialState, action) {
    const { payload, type } = action;

    switch (type) {
        case SET_EXPENSE_CATEGORIES:
        {
            const { categories } = saveCategories(payload);

            return { ...state, categories };
        }
        case SET_CREATE_EXPENSE_CATEGORIES:
        {
            const { category } = payload;
            saveCategory(category);

            return { ...state, categories: [ category.id, ...state.categories ] };
        }
        case SET_EDI_EXPENSE_CATEGORIES:
        {
            const { category } = payload;
            saveCategory(category);

            return { ...state, categories: [ ...state.categories ] };
        }
        case SET_REMOVE_EXPENSE_CATEGORIES:
        {
            const { id } = payload;
            deleteCategory(id);

            return { ...state, categories: state.categories.filter(cId => cId !== id) };
        }
        default:
            return state;
    }
}
