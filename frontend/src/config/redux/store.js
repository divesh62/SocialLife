import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/reducer/authReducer';
import postReducer from '../redux/reducer/postReducer';


const store = configureStore({
    reducer: {
        auth : authReducer,
        posts: postReducer,
    },
});

export default store;   