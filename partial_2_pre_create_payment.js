// wait for Comgate Checkout SDK to load
document.addEventListener("ComgateCheckoutReady", function () {
    // creation of ComgateCheckout instance
    window
        .ComgateCheckout({
            checkoutId: "xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx", // (mandatory) obtained in step 5
            locale: "cs", // (optional, default: cs) UI language

            debug: true, // (optional, default: false) detailed development information to the console !!! DO NOT USE 'true' ON PRODUCTION !!!

            transactionId: "XXXX-XXXX-XXXX", // (required) Comgate Transaction ID obtained after calling /v1.0/create

            onPaid: (payload) => { // (mandatory) payment has been paid
                /* TODO DIY */
            },
            onCancelled: (payload) => { // (mandatory) payment was cancelled or expired
                /* TODO DIY */
            },
            onPending: (payload) => { // (optional) if the payment attempt failed, the payment can continue
                /* TODO DIY nebo nedefinovat */
                // if no action is taken, it is advisable not to define the callback
            },
            onClick: (payload) => { // (optional) called after clicking the button, before processing the payment [confirmation required]
                /* TODO DIY nebo nedefinovat */
                // if no action is taken, it is advisable not to define the callback

                // at the end of the defined callback you must call
                //     payload.resolve() - continue payment
                //     payload.reject() - cancel the action and do not continue
                // otherwise the wait will get stuck
                if ("resolve" in payload) {
                    payload.resolve();
                }
            },
            onError: (payload) => { // (mandatory) Error details during processing
                /* TODO DIY */
                // A substantial part of the payment processing is done asynchronously and therefore cannot be linked to the standard try-catch block.
                // if this callback is called, the payment is no longer continued, the Comgate ID of the transaction can be used again
                // most errors are automatically reported to Comgate for their tuning and possible correction
                // errors caused by improper implementation of the developer will not be corrected
            }
        })
        .then((checkoutInstance) => {
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