import React from "react";

const s1 = {
  name: "counter",
  state: {
    key: "count",
    value: 0
  },
  action: {
    key: "increment",
    value: s => s + 1
  }
};

const s2 = {
  name: "reverse",
  state: {
    key: "text",
    value: "vikash"
  },
  action: {
    key: "reverse",
    value: s => s.split('').reverse().join('')
  }
};

const store = (() => {
  const allContext = {};
  const allProvider = [];
  
  [s1, s2].forEach(s => {
    let context = React.createContext();
    context.displayName=s.name
    function Provider(props) {
      const [state, setState] = React.useState(s.state.value);
      const value = {
        [s.state.key]: state,
        [s.action.key]: () => {
          const newState = s.action.value(state);
          setState(newState);
        }
      };
      return (
        <context.Provider value={value}>{props.children}</context.Provider>
      );
    }
    Provider.displayName = s.name;
    allContext[s.name] = context;
    allProvider.push(Provider);
  });

  const Store = Comp => {
    let init = ''
    allProvider.forEach((P, index) => {
        if(index === 0){
            init = <P>{<Comp></Comp>}</P>
        }else{
            init = <P>{init}</P>
        }
    });
    return <>{init}</>
  };

  console.log('store', Store)
  return {
    Provider: Store,
    context: allContext
  };
})();

export default store;
