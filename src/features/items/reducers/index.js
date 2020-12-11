import {
    SET_ITEMS,
    CLEAR_ITEM,
    SET_ITEM,
    DELETE_ITEM,
    SET_FILTER_ITEMS,
} from '../constants';
import { saveItems, deleteItem } from '~/selectors/schemas';

const initialState = {
    items: [],
    filterItems: [],
    item: null
};

export default function itemReducer(state = initialState, action) {
    const { payload, type } = action;

    switch (type) {
        case SET_ITEMS:
        {
            const { items, fresh, prepend } = saveItems(payload);

            if (prepend) {
                return { ...state, items: [...items, ...state.items] };
            }

            if (!fresh) {
                return { ...state, items: [...state.items, ...items] };
            }

            return { ...state, items };
        }
        case SET_FILTER_ITEMS:
        {
            const { items, fresh } = saveItems(payload);

            if (!fresh) {
                return {
                    ...state,
                    filterItems: [...state.filterItems, ...items]
                };
            }

            return { ...state, filterItems: items };
        }
        case DELETE_ITEM:
        {
            const { id } = payload

            deleteItem(id);

            return { ...state, items: state.items.filter(val => val !== id) };
        }
        case CLEAR_ITEM:
            return { ...state, item: null };

        case SET_ITEM:
            return { ...state, item: payload.item };

        default:
            return state;
    }
}
