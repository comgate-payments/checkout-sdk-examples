/**
 * Create Apple Pay button
 * @param {ComgateCheckout} checkoutInstance instance Comgate checkout
 */
function demo_createApplePay(checkoutInstance) {
    checkoutInstance
        .createApplePay({ // alternative functional notation for createApplePay({}), createApplePay()
            // a complete list of parameters is available at https://apidoc.comgate.cz/?lang=en#api-component-definition
            style: {
                // values according to Apple Pay documentation
                style: "black", // (optional, default: black, options: black, white, white-outline) button style
                type: "pay", // (optional, default: pay, options: plain, buy, book, donate, ...) button type
                width: "400px", // default: 100%
                height: "45px" // default: 100%
            },
            locale: "cs-CZ" // (optional, default: cs-CZ, options: en-US, de-DE, sk-SK, ...) UI language
        })
        .then(async (applepayInstance) => {
            const res = await applepayInstance.canMakePayment();
            if (res.result === true) {
                applepayInstance.mount("#apple-pay-button-box");
            } else {
                console.log("Comgate Checkout: Apple Pay is not available on this device");
            }
        })
        .catch((error) => {
            console.log("Comgate Checkout: Error creating Apple Pay button.");
        });
}