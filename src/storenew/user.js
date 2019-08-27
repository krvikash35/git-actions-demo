import axios from 'axios';

export const name = 'vikash'
export async function getUsers(){
    const url = 'https://jsonplaceholder.typicode.com/users'
    const config = {}
    const res = await axios.get(url, config)
    // return s => ({data: res.data})
    return res.data;

}


export async function getUser(id){
    const url = `https://jsonplaceholder.typicode.com/users/${id}`
    const config = {}
    const res = await axios.get(url, config)
    return s => ({data: res.data})
}

export function hello(){
    console.log('inside hello')
    return {name: 'koushik'}
    return s => ({name: 'hello '+s.name})
}
// hello.sync = true;