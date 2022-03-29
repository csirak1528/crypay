
const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const apiUrl = "http://localhost:3001"
window.onload = function () {
    document.getElementById('pay').onclick = async () => {
        document.getElementById('verifyres').innerHTML = "<h3 class=\"waiting transaction-info\">Waiting<h3>"
        let price = await getPrice()
        var iteminfo = localStorage.getItem("iteminfo")
        var id = await createPayment(price, iteminfo)

        if (id) {
            var url = `http://localhost:3000/pay?id=${id}`;
            var width = 390;
            var height = 600;
            var left = window.screenX + (window.outerWidth - width) / 2;
            var top = window.screenY + (window.outerHeight - height) / 2;
            let popup = window.open(url, "Crypay", "location=1,toolbar=1,menubar=1,resizable=0,width=370,height=600");
        } else {
            alert("Payment Failed. Leave us feedback!")
        }
    }
};

const activateScripts = async () => {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    chrome.scripting.executeScript({
        files: ["scripts1.js"],
        target: { tabId: tab.id },
    })
}

const createPayment = async (price, info) => {
    var id = UUIDv4.generate()
    var obj = {
        price,
        info,
        id
    }
    const res = await (await fetch(`${apiUrl}/payments/create`, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })).json();
    (async () => {
        await timeout(2000)
        verifyTransaction(id)
    })();

    if (res.res == "success") {
        return id
    } else { return false }
}

const verifyTransaction = async (id) => {
    var obj = {
        id
    }
    const res = await (await fetch(`${apiUrl}/payments/get`, {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    })).json()
    const status = res.body.status
    if (status == "complete") {
        document.getElementById('verifyres').innerHTML = "<h3 class=\"verified transaction-info\">Transaction Verified!<h3>"
        activateScripts()
    } else if (status == "fail") {
        document.getElementById('verifyres').innerHTML = "<h3 class=\"failed transaction-info\">Transaction Failed<h3>"
    }
    else {
        await timeout(2000)
        await verifyTransaction(id)
    }
}




var UUIDv4 = new function () {
    function generateNumber(limit) {
        var value = limit * Math.random();
        return value | 0;
    }

    function generateX() {
        var value = generateNumber(16);
        return value.toString(16);
    }

    function generateXes(count) {
        var result = '';
        for (var i = 0; i < count; ++i) {
            result += generateX();
        }
        return result;
    }

    function generateVariant() {
        var value = generateNumber(16);
        var variant = (value & 0x3) | 0x8;
        return variant.toString(16);
    };
    this.generate = function () {
        var result = generateXes(8)
            + '-' + generateXes(4)
            + '-' + '4' + generateXes(3)
            + '-' + generateVariant() + generateXes(3)
            + '-' + generateXes(12)
        return result;
    };
};
const getElementByXpath = (path) => {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
let ebayxpath = "#mainContent > div.two-column.container.no-gutters > div > div.right-column.col-5.col-lg-4 > div:nth-child(3) > section > div.summary > div.summary-table > table > tbody > tr:nth-child(4) > td.amount > span > span"

const getPrice = async () => {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    let page = await (await fetch(tab.url)).text()
    let price = parseFloat(page.split(`"textSpans":[{"_type":"TextSpan","text":"$`).slice(-1)[0].split("\"")[0])
    return price;

}