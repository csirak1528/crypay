
const paymentInfo = {
    name: {
        first: "Caleb",
        last: "Sirak"
    },
    card: {
        number: "5200 8282 8282 8210",
        cvv: "253",
        date: "12/26"
    },
    address: {
        street: "11717 Trotter Point Court",
        city: "Clarksvalle",
        region: "MA",
        zip: "21028",
        phone: "2022368836",
        country: "US"
    }
}


const clickCard = () => {
    document.querySelector("#mainContent > div.two-column.container.no-gutters > div > div.left-column.col-7.col-lg-8 > section.module.payment-methods.auto-address-container > div").style.opacity = "0"
    document.querySelector("#payment-selection-fieldset > div.payment-entry--CC.payment-entry > div.render-summary.payment-entry--render-summary.show-all-logos.selectable").click();

    document.querySelector("#cardNumber").setAttribute('value',paymentInfo.card.number);
    document.querySelector("#cardExpiryDate").value = paymentInfo.card.date;
    document.querySelector("#securityCode").value = paymentInfo.card.cvv;


    document.querySelector("#credit-card-details > section:nth-child(2) > div > div > div > div:nth-child(2) > span > span > a").click()

    document.querySelector("#cardHolderFirstName").value = paymentInfo.name.first;
    document.querySelector("#cardHolderLastName").value = paymentInfo.name.last;

    document.querySelector("#country").value = paymentInfo.address.country;

    document.querySelector("#addrLine1").value = paymentInfo.address.street;
    document.querySelector("#city").value = paymentInfo.address.city;
    document.querySelector("#state").value = paymentInfo.address.region;
    document.querySelector("#postalCode").value = paymentInfo.address.zip;
    document.querySelector("#phoneNumber").value = paymentInfo.address.phone;
    document.querySelector("#mainContent > div.two-column.container.no-gutters > div > div.left-column.col-7.col-lg-8 > section.module.payment-methods.auto-address-container > div").style.opacity = "1"
}




clickCard()