/**
 * Create Google Pay button
 * @param {ComgateCheckout} checkoutInstance instance Comgate checkout
 */
function demo_createGooglePay(checkoutInstance) {
    checkoutInstance
        .createGooglePay({ // alternative functional notation of the createGooglePay({}) method, createGooglePay()
            // kompletní seznam parametrů je dostupný níže
            style: {
                // values according to Google Pay documentation
                style: "black", // (optional, default: black, options: black, white) button style
                type: "pay", // (optional, default: pay, options: plain, buy, book, donate, ... ) button type
                width: "400px", // default: 100%
                height: "45px" // default: 100%
            },
            locale: "cs" // (optional, default: cs, options: en, de, sk, ...) UI language
        })
        .then(async (googlepayInstance) => {
            const res = await googlepayInstance.canMakePayment();
            if (res.result === true) {
                googlepayInstance.mount("#google-pay-button-box");
            } else {
                console.log("Comgate Checkout: Google Pay is not available on this device");
            }
        })
        .catch((error) => {
            console.log("Comgate Checkout: Error creating Google Pay button.");
        });
}