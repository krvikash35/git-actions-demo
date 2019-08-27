import React from 'react';


const reverseContext = React.createContext()

function ReverseProvider(props){
    const [text, setText] = React.useState('vikash')
    const state = {
        text: text,
        reverse: () => setText(s => s.split('').reverse().join(''))
    }
    return <reverseContext.Provider value={state}>{props.children}</reverseContext.Provider>
}

export default reverseContext
export {ReverseProvider}