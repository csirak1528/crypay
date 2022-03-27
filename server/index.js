const axios = require('axios');
const express = require('express')
var bodyParser = require('body-parser');
require('express-group-routes');

const app = express()
var cors = require('cors')
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());

const CoinGecko = require('coingecko-api');
const crypto = require('./crypto/ether.js')

const {
    getEthBalance,
    getEthBalances,
    verifyTransaction
} = crypto;

const jobs = require('./jobs.js');
const helpers = require('./helper.js');

const { searchTickers } = helpers

const data = require("./tickers.json")
var tickers = { data }

const cache = {}
const CoinGeckoClient = new CoinGecko();
const second = 1000
const minute = 60 * second;

const getCoin = async (token) => {
    if (cache[token]) {
        if (cache[token].timestamp - minute < Date.now()) {
            return cache[token]
        }
    }
    const { data, } = await CoinGeckoClient.coins.fetch(token, {});
    const name = data.name
    const { image, market_data, links } = data
    const { current_price } = market_data
    const out = { image, current_price, links, name, timestamp: Date.now() }
    cache[token] = out

    return out;
}


const supported = ["ethereum", "bitcoin", "tether"]

app.group("/eth", (router) => {
    router.get('/price', async (req, res) => {
        const price = await getCoin("ethereum")
        res.json({ price })
    })
    router.post('/balance', async (req, res) => {
        const price = await getCoin("ethereum")
        const balance = await getEthBalance(req.body.acct, price.current_price.usd)
        res.json({ balance })
    })
    router.post('/multBalance', async (req, res) => {
        const price = await getCoin("ethereum")
        const balance = await getEthBalances(req.body.accts, price.current_price.usd)
        res.json({ balance })
    })
});

app.group("/payments", (router) => {
    router.post('/create', async (req, res) => {
        let status = "created"
        const { price, info, id } = req.body;
        cache[id] = { price, info, id, status }
        res.json({ res: "success" })
    })
    router.post('/get', async (req, res) => {
        const { id } = req.body;
        if (cache[id]) {
            res.json({ res: "success", body: cache[id] })
        }
        else {
            res.json({ res: "fail" })

        }
    })
    router.post('/complete', async (req, res) => {
        const { id } = req.body
        let verify = await verifyTransaction(req.body)
        if (verify == "complete") {
            cache[id] = {
                ...cache[id],
                ...req.body,
                status: verify
            }
            res.json({ res: "success" })
        } else {
            res.json({ res: "fail" })
        }
    })
})

app.get('/all', async (req, res) => {
    let data = []
    await Promise.all(supported.map(async (tick) => {
        try {
            let out = await getCoin(tick)
            data.push(out)
        } catch {

        }
    }))
    res.json({ all: data })
})

// app.get('/cache', async (req, res) => {
//     console.log(cache)
//     res.json({ cache })
// })

app.post('/search', async (req, res) => {
    let searchIds = searchTickers(tickers.data, req.body.term)
    let data = []
    await Promise.all(searchIds.map(async ({ id: tick }) => {
        try {
            let out = await getCoin(tick)
            data.push(out)
        } catch {
        }
    }))
    res.json({ all: data.slice(0, 20) })
})

const port = process.env.PORT || 3001

app.listen(port, async () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = {
    getCoin
}