// wait for Comgate Checkout SDK to load
document.addEventListener("ComgateCheckoutReady", function () {
    let applePayInstanceRef = null;
    let googlePayInstanceRef = null;

    // creation of ComgateCheckout instance
    window
        .ComgateCheckout({
            checkoutId: "xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx", // (mandatory) obtained in step 5
            locale: "cs", // (optional, default: cs) UI language

            debug: true, // (optional, default: false) detailed development information to the console !!! DO NOT USE 'true' ON PRODUCTION !!!

            // transactionId: '<?= $transactionId ?>', // Sample for PHP
            transactionId: "XXXX-XXXX-XXXX", // (required) Comgate Transaction ID obtained after calling /v1.0/create

            onPaid: (payload) => { // (mandatory) payment has been paid
                removeButtons();
                alert("The payment was successfully made.");
            },
            onCancelled: (payload) => { // (mandatory) payment was cancelled or expired
                removeButtons();
                alert("Payment was cancelled or expired.");
            },
            onPending: (payload) => { // (optional) if the payment attempt failed, the payment can continue
                alert("Payment failed, try again.");
                // if no action is taken, it is advisable not to define the callback
            },
            onClick: (payload) => { // (optional) called after clicking the button, before processing the payment [confirmation required]
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
            onError: (payload) => {
                // (mandatory) Error details during processing
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
            // a complete list of parameters is available at https://apidoc.comgate.cz/?lang=en#api-component-definition
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