const search = (source, compatFunc, l, r, term) => {
    let out = []
    let mid = Math.floor((r + l) / 2);
    if (r - l > 1) {
        let res = compatFunc(term, source[mid])
        if (res == 0) {
            let cur = addOut(source, compatFunc, mid, term)
            out.push(...cur)
        }
        else if (res == -1) {
            let left = search(source, compatFunc, l, mid - 1, term)
            out.push(...left)
        }
        else if (res == 1) {
            let right = search(source, compatFunc, mid + 1, r, term)
            out.push(...right)
        }
    }
    return out
}

const addOut = (source, compatFunc, mid, term) => {
    let out = []
    out.push(source[mid])
    let i = mid - 1;
    for (i; i >= 0; i--) {
        if (compatFunc(term, source[i]) == 0) {
            out.push(source[i])
        }
        else {
            break;
        }
    }
    for (i = mid + 1; i < source.length; i++) {
        if (compatFunc(term, source[i]) == 0) {
            out.push(source[i])
        } else {
            break;
        }

    }
    return out
}



const baseCompare = (term, obj) => {
    let curState = 0
    term = term.toLowerCase()
    let out = Object.values(obj).map(val => {
        val = val.toLowerCase()
        if (val.includes(term)) {
            return 0;
        }
        else if (term > val) {
            curState = 1
            return 1
        }
        else {
            curState = -1
            return - 1
        }
    })
    if (out.indexOf(0) + 1) {
        return 0
    }
    return curState;
}

const searchTickers = (source, term) => {
    return search(source, baseCompare, 0, source.length - 1, term)
}

// let data = require("./tickers.json")
// let tickers = { data }
// let out = searchTickers(tickers.data, "bitc")
// // let out = baseCompare("tethe", { id: 'fam-token', symbol: 'fam', name: 'FAM Token' })
// console.log(out)


module.exports = {
    searchTickers
}