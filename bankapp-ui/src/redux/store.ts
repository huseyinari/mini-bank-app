import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage kullanımı için
import authReducer from "./slices/authSlice";

const persistConfig = {
    key: 'root',
    storage,
};

const rootReducer = combineReducers({
    authReducer
});

// Persist edilmiş reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})

// Persistor'u oluştur
const persistor = persistStore(store);

export { store, persistor };
