import axios from 'axios';
import {setupCancelToken} from '../module/mstore'


export const name = 'vikash'
export async function getUsers(){
    const url = 'https://jsonplaceholder.typicode.com/users'
    const config = {}
    setupCancelToken('user1', 'getUsers', config)
    const res = await axios.get(url, config)
    return res.data;
}


export async function getUser(id){
    const url = `https://jsonplaceholder.typicode.com/users/${id}`
    const config = {}
    setupCancelToken('user', 'getUser', config)
    const res = await axios.get(url, config)
    return s => ({data: res.data})
}

export function hello(){
    return new Promise((res) => {
        setTimeout(() => {
            return res( s => ({name: 'hello koushik', error: 'mydata'}))
            // return res( {name: 'vikash'})
        }, 1000);
    })
    // NotifyReporter.()
    // return {name: 'koushik'}
    // return s => ({name: 'hello '+s.name})
}
// hello.sync = true;

export function resetAll(){
    // return {name: 'kumar'}
    // return {null: null}
    return new Promise(res => {
        setTimeout(() => {
            // return res({name: 'kumar', data: 'resetall', getUsers: [{id: 12, name: 'vikash'}]})
            return res(s => ({name: 'kumar', data: 'resetall', getUsers: [{id: 12, name: 'vikash'}]}))
        }, 1000);
    })
}
// resetAll.sync=true