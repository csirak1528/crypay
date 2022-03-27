const cron = require('node-cron');
const fs = require('fs');

const k = require("./tickers.json")


// const startCron = (tickers, CoinGeckoClient) => {
//     cron.schedule('0 0 * * *', async () => {

//         tickers.data = await getTickers(tickers, CoinGeckoClient)

//     });
// }
const getTickers = async (CoinGeckoClient) => {
    const out = await CoinGeckoClient.coins.list();
    const { data } = out;
    return data
}
module.exports = {
    getTickers,
    //startCron
}

