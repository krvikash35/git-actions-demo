import axios from 'axios'

function modify1(f){
    f.token = 'abc'
    return
}
export const count = 1;

export function incAsync(n){
    return new Promise((res, rej) => {
        setTimeout(() => {
            if(n<0) return rej('can not be negative')
            return res('increase success')
        }, 2000);
    })
}

export function decAsync(n){
    return new Promise((res, rej) => {
        setTimeout(() => {
            if(n<0) return rej('can not be negative')
            return res('decrease success')
        }, 2000);
    })
}

export function inc(n, e, s){
    return {...s, count: s.count+n}
}
inc.sync = true;

export async function fetchTodo(s){
    const url = 'https://jsonplaceholder.typicode.com/todos/1'
    const config = {}
    modify1(fetchTodo)
    const res = await axios.get(url, config)
    console.log('updated state', s)
 
}

export function test(s){
    setTimeout(() => {
        console.log('state', s)
    }, 2000);

    return s => ({count: s.count+1})
}