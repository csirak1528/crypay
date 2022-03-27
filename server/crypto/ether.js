const Web3 = require("web3")
const test = true
const infura_key = test ? "https://rinkeby.infura.io/v3/d22e7e2e66a34892a9535b08658dc52e" : "https://mainnet.infura.io/v3/d22e7e2e66a34892a9535b08658dc52e"
const web3 = new Web3(new Web3.providers.HttpProvider(infura_key))

const getEthBalance = async (acct, price) => {
    try {
        let result = await web3.eth.getBalance(acct)
        return Number(web3.utils.fromWei(result, "ether")) * price
    } catch (e) {
        console.log(e)
        return 0;
    }
}

const getEthBalances = async (accts, price) => {
    try {
        return await Promise.all(accts.map(async (acct) => {
            let result = await web3.eth.getBalance(acct)
            return Number(web3.utils.fromWei(result, "ether")) * price
        }))
    } catch (e) {
        console.log(e)
        return 0;
    }
}

const verifyTransaction = async (data) => {
    let res = await web3.eth.getTransactionReceipt(data.transactionHash)
    let status = "complete"
    let checkKeys = ["blockHash", "blockNumber", "from", "gasUsed", "to", "transactionHash"]
    for (key in checkKeys) {
        if (data[key] != res[key]) {
            status = "fail"
            break;
        }
    }
    return status
}



module.exports = {
    getEthBalance,
    getEthBalances,
    verifyTransaction
}