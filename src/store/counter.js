import React, {useState} from 'react';

const countContext = React.createContext()


function CountProvider(props){
    const [count, setCount] = useState(0)
    const state = {
        count: count,
        increment: () => setCount(s => s+1)
    }
    
    return <countContext.Provider value={state}>{props.children} </countContext.Provider>
}

export default countContext;
export {CountProvider}