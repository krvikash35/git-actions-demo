import React, { useContext, useState, createContext, useRef } from "react";
import axios from "axios";

const allProviders = [];
const allContexts = {};

function mergeState(state, delta, actionKey) {
  const deltaState = {};
  const { data, error, ...restDelta } = delta;
  Object.keys(restDelta).forEach(deltaKey => {
    if (state.hasOwnProperty(deltaKey)) {
      if (state[deltaKey].hasOwnProperty("loading")) {
        deltaState[deltaKey] = {
          ...state[deltaKey],
          data: restDelta[deltaKey]
        };
      } else {
        deltaState[deltaKey] = restDelta[deltaKey];
      }
    }
  });
  if (data) {
    deltaState[actionKey] = { data, loading: false, error: null };
  } else if (error) {
    deltaState[actionKey] = {
      data: state[actionKey].data,
      loading: false,
      error
    };
  }
  return deltaState;
}

function isAction(storeAttr) {
  return typeof storeAttr === "function";
}

function isSyncAction(storeAttr) {
  return isAction(storeAttr) && storeAttr.sync === true;
}

function initStoreState(store) {
  const state = {};
  Object.keys(store).forEach(storeAttrName => {
    const storeAttr = store[storeAttrName];
    if (!isAction(storeAttr)) {
      state[storeAttrName] = storeAttr;
    } else if (!isSyncAction(storeAttr)) {
      state[storeAttrName] = { loading: false, data: null, error: null };
    }
  });
  return state;
}

function setupStoreProviderValue(store, state, setState, stateRef) {
  const value = {};
  Object.keys(store).forEach(storeAttrName => {
    const storeAttr = store[storeAttrName];
    if (!isAction(storeAttr)) {
      value[storeAttrName] = state[storeAttrName];
    } else if (isSyncAction(storeAttr)) {
      value[storeAttrName] = (...p) => {
        let stateChanges = storeAttr(...p, stateRef);
        if (isAction(stateChanges)) {
          stateChanges = stateChanges(stateRef.current);
        }
        const newState = mergeState(stateRef.current, stateChanges);
        setState(s => ({ ...s, ...newState }));
      };
    } else {
      value[storeAttrName] = async (...p) => {
        setState({
          ...state,
          [storeAttrName]: { ...state[storeAttrName], loading: true }
        });
        try {
          const promise = storeAttr(...p, stateRef);
          //todo setup axios cancel token
          //todo set state and data
          const stateUpdater = await promise;
          // console.log('resolve promise', stateUpdater)
          // delete state[storeAttrName]
          return
          if (isAction(stateUpdater)) {
            const stateChanges = stateUpdater(stateRef.current);
            const newState = mergeState(
              stateRef.current,
              stateChanges,
              storeAttrName
            );
            setState(s => ({ ...s, ...newState }));
          } else {
            setState(s => ({
              ...s,
              [storeAttrName]: {
                loading: false,
                data: stateUpdater,
                error: null
              }
            }));
          }
        } catch (stateUpdater) {
          if (isAction(stateUpdater)) {
            const stateChanges = stateUpdater(stateRef.current);
            const newState = mergeState(
              stateRef.current,
              stateChanges,
              storeAttrName
            );
            setState(s => ({ ...s, ...newState }));
          } else {
            //handle unhandled axios error
            if (axios.isCancel(stateUpdater)) {
              setState(s => ({
                ...s,
                [storeAttrName]: { ...s[storeAttrName], loading: false }
              }));
            } else {
              let error = {};
              if (stateUpdater.response) {
                error.code = stateUpdater.response.status;
                error.data = stateUpdater.response.data;
              } else if (stateUpdater.request) {
                error.code = "ERR_NO_SERVER_RESPONSE";
              } else {
                error.code = "ERR_AXIOS_REQUEST";
                error.message = stateUpdater.message;
              }
              setState(s => ({
                ...s,
                [storeAttrName]: { ...s[storeAttrName], loading: false, error }
              }));
            }
          }
        }
      };
      value[storeAttrName].data = state[storeAttrName].data;
      value[storeAttrName].loading = state[storeAttrName].loading;
      value[storeAttrName].error = state[storeAttrName].error;
      value[storeAttrName].reset = () => {
        setState(s => ({
          ...s,
          [storeAttrName]: { data: null, error: null, loading: false }
        }));
      };
    }
  });
  return value;
}

export function useStore(storeName) {
  const store = useContext(allContexts[storeName]);
  return store;
}

export function createStore(stores) {
  Object.keys(stores).forEach(storeName => {
    const store = stores[storeName];
    const context = createContext();
    context.displayName = storeName;

    function Provider(props) {
      const initialState = initStoreState(store);
      const [state, setState] = useState(initialState);
      const stateRef = useRef(state);
      stateRef.current = state;
      const providerValue = setupStoreProviderValue(
        store,
        state,
        setState,
        stateRef
      );
      return (
        <context.Provider value={providerValue}>
          {props.children}
        </context.Provider>
      );
    }
    Provider.displayName = storeName;

    allProviders.push(Provider);
    allContexts[storeName] = context;
  });

  return function Store(props) {
    let store = "";
    allProviders.forEach((P, index) => {
      if (index === 0) {
        store = <P>{props.children}</P>;
      } else {
        store = <P>{store}</P>;
      }
    });
    return store;
  };
}

export function setupCancelToken(axiosConfig, actionFunName) {}
