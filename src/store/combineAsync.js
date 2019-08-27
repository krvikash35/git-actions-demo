import React, { useState, useRef } from "react";

import * as counter from "./counterAsync";
import * as reverse from "./reverseAsync";

const myStore = {
  counter,
  reverse
};

const store = (() => {
  const allContext = {};
  const allProvider = [];

  Object.keys(myStore).forEach(key => {
    let s = myStore[key];
    let context = React.createContext();
    context.displayName = key;
    function Provider(props) {
      const init = {};
      Object.keys(s).forEach(k => {
          if(typeof s[k] === 'function'){
              if(!s[k].sync){

                  init[k] = { loading: false, data: null, error: null };
              }
          }else{
            init[k] = s[k]
          }
      });
      const [state, setState] = useState(init);
      const stateRef =  useRef(state)
      stateRef.current = state;

      let value = {};
      Object.keys(s).forEach(k => {
          if(typeof s[k] !== 'function'){
              value[k] = state[k]
            return
          }
          if(s[k].sync){
              value[k] = (...p) => {
                const newState = s[k](...p, state)
                console.log('state passing to sync', state)
                setState(newState);
                console.log('state after passing to sync', state)
              }
              return
          }
        value[k] = {};
        value[k] = async (...p) => {
          setState(st => ({ ...st, [k]: { ...st[k], loading: true } }));
          try {
            // const data = await s[k](...p);
            console.log('state passing to async', stateRef)
            const promise =  s[k](...p, stateRef);
            const data = await promise;
            setState(st => ({
              ...st,
              [k]: { data, loading: false, error: null }
            }));
          } catch (error) {
            setState(st => ({
              ...st,
              [k]: { ...st[k], loading: false, error: error }
            }));
          }
        };

        value[k].data = state[k].data;
        value[k].loading = state[k].loading;
        value[k].error = state[k].error;
        value[k].reset = () => {
            setState(s => ({...s, [k]: {data: null, loading: false, error: null}}) )
        }
        value[k].cancel = () => {

        }
        // value[k] = value[k].do
      });

      return (
        <context.Provider value={value}>{props.children}</context.Provider>
      );
    }
    Provider.displayName = key;
    allContext[key] = context;
    allProvider.push(Provider);
  });

  const Store = Comp => {
    let init = "";
    allProvider.forEach((P, index) => {
      if (index === 0) {
        init = <P>{<Comp />}</P>;
      } else {
        init = <P>{init}</P>;
      }
    });
    return <>{init}</>;
  };

  return {
    Provider: Store,
    context: allContext
  };
})();

export default store;
