import React, { useState, useEffect } from "react";
import './styles/Popup.css';
import axios from "axios"
import ReactLoading from 'react-loading';
import Menu from "./components/Menu";
import Settings from "./components/Settings";

const Web3 = require('web3')
var web3;
const baseAcc = '0x2aA0B709087553880C8127BB156Cf73a7a754f5a'

if (typeof window.ethereum !== 'undefined') {
  // Instance web3 with the provided information
  web3 = new Web3(window.ethereum);
  try {
    // Request account access
    window.ethereum.enable();
  } catch (e) {
    // User denied access
  }
}

const timeout = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function parseQuery(queryString) {
  var query = {};
  var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split('=');
    query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}


function App() {
  const [balance, setBalance] = useState([])
  const [item, setItem] = useState({ price: 0 })
  const [tokens, setTokens] = useState({})
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [fail, setFail] = useState("")
  const [searchRes, setSearchRes] = useState([])
  const [mainAcc, setMainAcc] = useState("")
  const [payReciept, setPayReciept] = useState("")
  const [viewMode, setViewMode] = useState("")
  const [paymentLoading, setPaymentLoading] = useState(false)



  useEffect(async () => {
    getItem()
    setLoading(true)
    getBalance()
    let data = await getAll()
    updateTickers(data)
    setLoading(false)

  }, [])


  const getItem = async () => {
    let params = new URLSearchParams(document.location.search);
    let id = params.get("id");
    let res = (await axios({
      method: 'post',
      url: `${base}/payments/get`,
      data: {
        id
      },
      headers: config.headers
    })).data
    if (res.res == "success") {
      if (res.body.price) {
        setItem(res.body)
      }
    }

  }

  const config = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
    }
  };
  const test = true
  const base = test ? "http://localhost:3001" : "https://crypay-node.herokuapp.com"

  const getBalance = async () => {
    var accounts = await web3.eth.getAccounts();
    let res = (await axios({
      method: 'post',
      url: `${base}/eth/multBalance`,
      data: {
        accts: accounts
      },
      headers: config.headers
    })).data.balance
    setMainAcc(accounts[0])
    setBalance(res)
  }

  const sumBalance = (arr) => {
    let tot = 0;
    arr.map((t) => {
      tot += t;
    })
    return tot
  }

  const getEther = async () => {
    let res = (await axios.get(`${base}/eth/price`, config)).data.price
    const price = res.current_price.usd
    const img = res.image.small
    const link = res.links.homepage[0]
    return { price, img, link }
  }

  const search = async () => {
    if (searchTerm.length >= 3) {
      setLoading(true)
      let res = (await axios({
        method: 'post',
        url: `${base}/search`,
        data: {
          term: searchTerm
        },
        headers: config.headers
      })).data.all

      res = res.map(ticker => {
        const price = ticker.current_price.usd
        const img = ticker.image.small
        const link = ticker.links.homepage[0]
        const name = ticker.name
        return { price, img, link, name }
      })

      res.sort((a, b) => {
        if (a.price > b.price) return -1;
        if (a.price < b.price) return 1;
        return 0;
      })
      setSearchRes(res)
      setLoading(false)
    } else {
      if (Object.keys(tokens).length == 0) {
        let data = await getAll()
        updateTickers(data)
      }
    }
  }

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      await search()
    }
  }

  const getAll = async () => {
    let result = (await axios.get(`${base}/all`, config)).data.all
    return result.map(res => {
      const price = res.current_price.usd
      const img = res.image.small
      const link = res.links.homepage[0]
      const name = res.name
      return { price, img, link, name }
    })
  }

  const openToken = (link) => {
    window.open(link);
  }

  const updateTickers = (data) => {
    data.map(ticker => {
      setTokens((prev) => ({ ...prev, [ticker.name]: ticker }))
    })
  }

  const displayTokens = (tokenData) => {
    return tokenData.map((token, index) => {
      let data = tokens[token]
      try {
        return data.price > .005 ? (
          <div key={index} className="token-wrapper row" id="">
            <span className="token-name-wrapper row">
              <img src={data.img} className="token-image" />
              <h4 className="token-name">{token}</h4>
            </span>
            <h4>${data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
          </div>
        ) : null
      } catch (err) { console.log(err, index) }
    })
  }

  const displayResults = (tokenData) => {
    return tokenData.map((data, index) => {
      try {
        return data.price > .005 ? (
          <div key={index} className="token-wrapper row" onClick={() => { openToken(data.link) }}>
            <span className="token-name-wrapper row">
              <img src={data.img} className="token-image" />
              <h4 className="token-name">{data.name}</h4>
            </span>
            <h4>${data.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h4>
          </div>
        ) : null
      } catch (err) { console.log(err, index) }
    })
  }

  function handleChange(event) {
    setSearchTerm(event.target.value);
  }
  // add email service receipt
  const pay = async () => {
    setPaymentLoading(true)
    if (mainAcc != baseAcc) {
      const price = (await getEther()).price
      await web3.eth.sendTransaction({
        to: baseAcc,
        from: mainAcc,
        value: web3.utils.toWei((item.price / price).toFixed(18), 'ether'),
      }, async (err, transactionHash) => {
        if (err) {
          alert('Transaction Failed')
        }
        else {
          var receipt = null;
          for (let i = 0; i < 60; i++) {
            if (receipt == null) {
              await timeout(1000)
              receipt = await web3.eth.getTransactionReceipt(transactionHash);
            }
          }
          if (receipt != null) {
            setPayReciept(receipt)
            await completeTransaction(receipt)
            await getBalance()
            setItem({ price: 0 })
            setPaymentLoading(false)

          } else {
            setPaymentLoading(false)
            alert('Transaction Failed')
          }
        }
      });

    }

    else {
      alert("Don't Send to yourself!")
    }
    setPaymentLoading(false)
  }

  const completeTransaction = async (reciept) => {
    let res = (await axios({
      method: 'post',
      url: `${base}/payments/complete`,
      data: {
        ...item,
        ...reciept
      },
      headers: config.headers
    })).data
    if (res.res != "success") {
      alert("Transaction Error")
    }
  }

  const iconSize = "25"

  return (
    <div className={"main-view"} >
      < Menu setViewMode={setViewMode} viewMode={viewMode} />
      <Settings setViewMode={setViewMode} viewMode={viewMode} />
      <div className="header-logo middle-center">
        <span className="clickable-icon" onClick={() => { setViewMode("menu") }}>
          <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} fill="white" class="bi bi-list" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
          </svg>
        </span>
        <h1>Crypay</h1>
        <span className="clickable-icon" onClick={() => { setViewMode("settings") }}>
          <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} fill="white" class="bi bi-gear" viewBox="0 0 16 16">
            <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
            <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
          </svg>
        </span>
      </div>

      <div className='balance-wrapper middle-center'>
        <h3 className="money-text">Balance: ${sumBalance(balance).toFixed(2)}</h3>
        <h3 className="money-text">Cart Value: ${item.price.toFixed(2)}</h3>
      </div>
      <div className="actions-wrapper middle-center">
        <div className="selection-button" onClick={pay}>Pay</div>

      </div>
      <div className="search-bar-wrapper row">
        <input value={searchTerm} onChange={handleChange} onKeyDown={handleKeyDown} className="search-bar" placeholder="Search Coins..." />
        <div className="search" onClick={search}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" className="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
        </div>
      </div>
      <div>
        {(loading || paymentLoading) ?
          <div className="middle-center">
            {paymentLoading ?
              <h3>Transaction Processing</h3>
              : null}
            <ReactLoading type={"bubbles"} color={"gray"} height={60} width={60} />
          </div>
          :
          ((searchTerm.length > 3 && searchRes.length) ? displayResults(searchRes) : displayTokens(Object.keys(tokens)))}
      </div>
    </div >
  );
}

export default App;
