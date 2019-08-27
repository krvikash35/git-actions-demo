import React from 'react';

import counter from './counter'
import reverse from './reverse'


const counterValue = {
    count: 0,
    increment: () => {}
}

const reverseValue = {
    text: 'vikash',
    reverse: () => {}
}

export default function CombineAll(props){
    return (
        <counter.Provider value={counterValue}>
            <reverse.Provider value={reverseValue}>
            {props.children}
            </reverse.Provider>
        </counter.Provider>
    )
}