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