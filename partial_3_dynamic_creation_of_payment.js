// wait for Comgate Checkout SDK to load
document.addEventListener("ComgateCheckoutReady", function () {
    // proměnná pro referenci na instanci ComgateCheckout
    let checkoutInstanceRef = null;

    // creation of ComgateCheckout instance
    window
        .ComgateCheckout({
            checkoutId: "xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx", // (mandatory) obtained in step 5
            locale: "cs", // (optional, default: cs) UI language

            debug: true, // (optional, default: false) detailed development information to the console !!! DO NOT USE 'true' ON PRODUCTION !!!

            // list only the services you want to use
            prefetch: ['googlepay'], // (optional) preload the script for Google Pay (Apple Pay is always preloaded)

            onRequirePayment: async (payload) => { // (mandatory) Incorporation and delivery of Comgate transaction ID is requested
                /* TODO DIY */
                // when calling a callback it is necessary to call the API of the e-shop and create a new payment and return the Comgate ID of the transaction
                // all data on price, currency and other parameters is safe to retrieve on the side of the server and not to send it to yourself in the call here,
                // it could be counterfeited.
                // you can use the helper method supplied in payload to send requests to your server payload.eshopRequest(/*...*/)
                // or by saving the ComgateCheckout instance into the checkoutInstance.eshopRequest(/*...*/)
            },
            onPaid: async (payload) => { // (mandatory) payment has been paid
                /* TODO DIY */
            },
            onCancelled: async (payload) => { // (mandatory) payment was cancelled or expired
                /* TODO DIY */
            },
            onPending: async (payload) => { // (optional) if the payment attempt failed, the payment can continue
                /* TODO DIY nebo nedefinovat */
                // if no action is taken, it is advisable not to define the callback
            },
            onClick: async (payload) => { // (optional) called after clicking the button, before processing the payment [confirmation required]
                /* TODO DIY nebo nedefinovat */
                // if no action is taken, it is advisable not to define the callback

                // at the end of the defined callback you must call
                //     payload.resolve() - continue payment
                //     payload.reject() - cancel the action and do not continue
                // otherwise the wait will get stuck
                payload.resolve();
            },
            onError: async (payload) => { // (mandatory) Error details during processing
                /* TODO DIY */
                // A substantial part of the payment processing is done asynchronously and therefore cannot be linked to the standard try-catch block.
                // if this callback is called, the payment is no longer continued, the Comgate ID of the transaction can be used again
                // most errors are automatically reported to Comgate for their tuning and possible correction
                // errors caused by improper implementation of the developer will not be corrected
            }
        })
        .then((checkoutInstance) => {
            checkoutInstanceRef = checkoutInstance;
            // ComgateCheckout instance ready to configure specific services
            /* TODO DIY implementation of selected functionalities */
        })
        .catch((error) => {
            /* TODO DIY */
            // an unexpected error occurred while creating the ComgateCheckout instance and payments cannot be processed
            // these errors are not automatically recorded by Comgate and are mainly caused by incorrect implementation of the ComgateCheckout SDK
            console.error("ComgateCheckout Init ERROR: ", error);
        });
});