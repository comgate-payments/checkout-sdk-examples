// POST request to the e-shop API server
checkoutInstanceRef
    .eshopRequest({
        method: "POST",
        url: "https://eshop.cz/api/create-transaction",
        validStatus: 201, // (optional, default: 200) HTTP status code that is considered successful
        checkSuccessParam: true, // (optional, default: false) response is JSON and contains the 'success' parameter, which must be true
        body: { // send as POST JSON body (POST only)
            param: "value",
            param2: "value2"
        },
        query: { // send as GET parameters in URL (both POST and GET)
            param: "value",
            param2: "value2"
        }
    })
    .then((response) => {
        // response server must be supported by Axios library for automatic ripping
        // OK
    })
    .catch((error) => {
        // request failed
        console.log("Checkout eshopRequest ERROR: ", error);
        payload.reject();
    });