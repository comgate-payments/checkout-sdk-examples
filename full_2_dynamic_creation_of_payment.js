// wait for Comgate Checkout SDK to load
document.addEventListener("ComgateCheckoutReady", function () {
    let checkoutInstanceRef = null;
    let applePayInstanceRef = null;
    let googlePayInstanceRef = null;

    // creation of ComgateCheckout instance
    window
        .ComgateCheckout({
            checkoutId: "xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx", // (mandatory) obtained in step 5
            locale: "cs", // (optional, default: cs) UI language

            debug: true, // (optional, default: false) detailed development information to the console !!! DO NOT USE 'true' ON PRODUCTION !!!

            // list only the services you want to use
            prefetch: ['googlepay'], // (optional) preload the script for Google Pay (Apple Pay is always preloaded)

            onRequirePayment: async (payload) => { // (mandatory) Incorporation and delivery of Comgate transaction ID is requested
                payload
                    .eshopRequest({
                        method: "POST",
                        url: "https://eshop.comgate.cz/api/create-transaction",
                        validStatus: 201, // (optional, default: 200) HTTP status code that is considered successful
                        checkSuccessParam: true, // (optional, default: false) response is JSON and contains the 'success' parameter, which must be true
                        body: { // send as POST JSON body (POST only)
                            orderId: "CZ2545686", // Order ID in online store
                        },
                    })
                    .then((response) => {
                        // OK
                        if(response && response.comgateTransactionId) {
                            payload.resolve(response.comgateTransactionId);
                        } else {
                            // invokes catch
                            return Promise.reject("Error during payment creation.");
                        }
                    })
                    .catch((error) => {
                        // request failed
                        console.log("Checkout eshopRequest ERROR: ", error);
                        payload.reject();
                    });
                // you can use the helper method supplied in payload to send requests to your server payload.eshopRequest(/*...*/)
                // or by saving the ComgateCheckout instance into the checkoutInstance.eshopRequest(/*...*/)
            },
            onPaid: async (payload) => { // (mandatory) payment has been paid
                removeButtons();
                alert("The payment was successfully made.");
            },
            onCancelled: async (payload) => { // (mandatory) payment was cancelled or expired
                removeButtons();
                alert("Payment was cancelled or expired.");
            },
            onPending: async (payload) => { // (optional) if the payment attempt failed, the payment can continue
                alert("Payment failed, try again.");
                // if no action is taken, it is advisable not to define the callback
            },
            onClick: async (payload) => { // (optional) called after clicking the button, before processing the payment [confirmation required]
                // if no action is taken, it is advisable not to define the callback

                alert("Payment will be made.");

                // at the end of the defined callback you must call
                //     payload.resolve() - continue payment
                //     payload.reject() - cancel the action and do not continue
                // otherwise the wait will get stuck
                if ("resolve" in payload) {
                    payload.resolve();
                }
            },
            onError: async (payload) => { // (mandatory) Error details during processing
                removeButtons();
                alert("Payment not made.");
                // A substantial part of the payment processing is done asynchronously and therefore cannot be linked to the standard try-catch block.
                // if this callback is called, the payment is no longer continued, the Comgate ID of the transaction can be used again
                // most errors are automatically reported to Comgate for their tuning and possible correction
                // errors caused by improper implementation of the developer will not be corrected
            }
        })
        .then((checkoutInstance) => {
            // configuration of specific services
            checkoutInstanceRef = checkoutInstance;
            demo_createApplePay(checkoutInstance);
            demo_createGooglePay(checkoutInstance);
        })
        .catch((error) => {
            removeButtons();
            // an unexpected error occurred while creating the ComgateCheckout instance and payments cannot be processed
            console.error("ComgateCheckout Init ERROR: ", error);
        });
});

/**
 * Remove checkout buttons
 */
function removeButtons() {
    if (applePayInstanceRef) {
        applePayInstanceRef.unmount();
    }
    if (googlePayInstanceRef) {
        googlePayInstanceRef.unmount();
    }
    let element = document.querySelector("#checkout-button-box");
    if (element) {
        // remove the button box from the page
        element.remove();
    }
}

/**
 * Create Apple Pay button
 * @param {ComgateCheckout} checkoutInstance instance Comgate checkout
 */
function demo_createApplePay(checkoutInstance) {
    checkoutInstance
        .createApplePay({ // alternative functional notation for createApplePay({}), createApplePay()
            // a complete list of parameters is available at https://apidoc.comgate.cz/?lang=en#definition-of-components-api
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
            applePayInstanceRef = applepayInstance;
            const res = await applepayInstance.canMakePayment();
            if (res.result === true) {
                applepayInstance.mount("#apple-pay-button-box");
            } else {
                console.log("Comgate Checkout: Apple Pay is not available on this device");
            }
        })
        .catch((error) => {
            console.log("Comgate Checkout: Error creating Apple Pay button.", error);
        });
}

/**
 * Create Google Pay button
 * @param {ComgateCheckout} checkoutInstance instance Comgate checkout
 */
function demo_createGooglePay(checkoutInstance) {
    checkoutInstance
        .createGooglePay({ // alternative functional notation of the createGooglePay({}) method, createGooglePay()
            // a complete list of parameters is available at https://apidoc.comgate.cz/?lang=en#definition-of-components-api
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
            googlePayInstanceRef = googlepayInstance;
            const res = await googlepayInstance.canMakePayment();
            if (res.result === true) {
                googlepayInstance.mount("#google-pay-button-box");
            } else {
                console.log("Comgate Checkout: Google Pay is not available on this device");
            }
        })
        .catch((error) => {
            console.log("Comgate Checkout: Error creating Google Pay button.", error);
        });
}