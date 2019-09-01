import { createStore } from "redux";
import rootReducer from "./reducers";

const initialState = {
    readings: {
        "The-Adventures-of-Tom-Sawyer": {
            chapter: 0,
            line: 0,
        }
    }
};

// localStorage persistence implementation: https://stackoverflow.com/questions/35305661/where-to-write-to-localstorage-in-a-redux-app
const persistedState = localStorage.getItem('reduxState') ? JSON.parse(localStorage.getItem('reduxState')) : initialState;
const store = createStore(rootReducer, persistedState);

store.subscribe(() => {
    localStorage.setItem('reduxState', JSON.stringify(store.getState()))
});

export default store;