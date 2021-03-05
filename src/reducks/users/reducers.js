import * as Actions from './actions'
import initialState from '../store/initialState'

export const UsersReducer = (state = initialState.users, action) => {
    switch(action.type) {
        case Actions.FETCH_ORDERS_HISTORY:
            return {
                // ... ←これをスプレッド構文という（オブジェクトの中身を全部展開する）
                ...state,
                orders: [...action.payload]
            };
        case Actions.FETCH_PRODUCTS_IN_CART:
            return {
                // ... ←これをスプレッド構文という（オブジェクトの中身を全部展開する）
                ...state,
                cart: [...action.payload]
            };
        case Actions.SIGN_IN:
            return {
                // ... ←これをスプレッド構文という（オブジェクトの中身を全部展開する）
                ...state,
                ...action.payload
            };
        case Actions.SIGN_OUT:
            return {
                // ... ←これをスプレッド構文という（オブジェクトの中身を全部展開する）
                ...action.payload
            };
        default:
            return state
    }
}