
function hello(){
    try {
        // throw  "vikash"
        // throw Error('vikash')
        // throw new Error('vikash')
        // throw {name: 'vikash'}
        throw () => {
            console.log('vikash')
        }
    } catch (error) {
        console.log('error', error)
        error()
    }
}
hello()