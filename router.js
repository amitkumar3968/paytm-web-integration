"use strict";
var paytm_config = require('./paytm/paytm_config').paytm_config;
var paytm_checksum = require('./paytm/checksum');
var querystring = require('querystring');
const https = require('https');
var fs = require('fs');
var index = fs.readFileSync('test.html');

let initiateHTML = `
<html>
   <head>
	  <title>Show Payment Page</title>
	  <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
	  <meta content="utf-8" http-equiv="encoding">
   </head>
   <body>
      <center>
         <h1>Please do not refresh this page...</h1>
      </center>
      <form method="post" action="https://securegw-stage.paytm.in/theia/api/v1/showPaymentPage?mid=MID-HERE&orderId=ORDERID-HERE" name="paytm">
         <table border="1">
            <tbody>
               <input type="hidden" name="mid" value="MID-HERE">
               <input type="hidden" name="orderId" value="ORDERID-HERE">
               <input type="hidden" name="txnToken" value="TXNTOKEN-HERE">
            </tbody>
         </table>
         <script type="text/javascript"> document.paytm.submit(); </script>
      </form>
   </body>
</html>
`;

let paymentHTML = `
<html>
   <head>
	  <title>Show Payment Page</title>
	  <meta content="text/html;charset=utf-8" http-equiv="Content-Type">
	  <meta content="utf-8" http-equiv="encoding">
   </head>
   <body>
      <center>
         <h1>Transaction Status</h1>
      </center>
      <div>PAYMENTSTATUS</div>
   </body>
</html>
`;

function route(request, response) {
	switch (request.url) {
		case '/':
			console.log("/ has started");
			response.writeHead(200, { 'Content-type': 'text/html' });
			// response.write('<html><head><title>Paytm-Amit</title><meta content="text/html;charset=utf-8" http-equiv="Content-Type"><meta content="utf-8" http-equiv="encoding"></head><body>');
			// response.write('</body></html>');

			response.write(index);
			response.end();
			break;
		case '/generate_checksum':
			if (request.method == 'POST') {


				var fullBody = '';
				request.on('data', function (chunk) {
					fullBody += chunk.toString();
				});
				request.on('end', function () {
					var decodedBody = querystring.parse(fullBody);
					let thechecksum;
					console.log(decodedBody);
					var paramarray = {};

					paramarray['MID'] = decodedBody.MID; //Provided by Paytm
					paramarray['ORDER_ID'] = decodedBody.ORDER_ID; //unique OrderId for every request
					paramarray['CUST_ID'] = decodedBody.CUST_ID;  // unique customer identifier 
					paramarray['INDUSTRY_TYPE_ID'] = decodedBody.INDUSTRY_TYPE_ID; //Provided by Paytm
					paramarray['CHANNEL_ID'] = decodedBody.CHANNEL_ID; //Provided by Paytm
					paramarray['TXN_AMOUNT'] = decodedBody.TXN_AMOUNT; // transaction amount
					paramarray['WEBSITE'] = decodedBody.WEBSITE; //Provided by Paytm
					paramarray['CALLBACK_URL'] = decodedBody.CALLBACK_URL;//Provided by Paytm
					paramarray['EMAIL'] = decodedBody.EMAIL; // customer email id
					paramarray['MOBILE_NO'] = decodedBody.MOBILE_NO; // customer 10 digit mobile no.
					//paramarray['requestType'] = decodedBody.requestType;
					console.log(paramarray);
					paytm_checksum.genchecksum(paramarray, paytm_config.MERCHANT_KEY, function (err, checksum) {
						console.log('v1 -Checksum: ', checksum, "\n");
						//thechecksum = checksum;
						response.writeHead(200, { 'Content-type': 'text/json', 'Cache-Control': 'no-cache' });
						response.write(JSON.stringify(checksum));
						response.end();
					});





				});



			} else {
				response.writeHead(200, { 'Content-type': 'text/json' });
				response.end();
			}
			break;
		case '/verify_checksum':
			if (request.method == 'POST') {
				var fullBody = '';
				request.on('data', function (chunk) {
					fullBody += chunk.toString();
				});
				request.on('end', function () {
					var decodedBody = querystring.parse(fullBody);

					console.log(decodedBody);

					// get received checksum
					var checksum = decodedBody.CHECKSUMHASH;

					// remove this from body, will be passed to function as separate argument
					delete decodedBody.CHECKSUMHASH;

					response.writeHead(200, { 'Content-type': 'text/html', 'Cache-Control': 'no-cache' });
					if (paytm_checksum.verifychecksum(decodedBody, paytm_config.MERCHANT_KEY, checksum)) {
						console.log("Checksum Verification => true");
						response.write("Checksum Verification => true");
					} else {
						console.log("Checksum Verification => false");
						response.write("Checksum Verification => false");
					}
					// if checksum is validated Kindly verify the amount and status 
					// if transaction is successful 
					// kindly call Paytm Transaction Status API and verify the transaction amount and status.
					// If everything is fine then mark that transaction as successful into your DB.			

					response.end();
				});
			} else {
				response.writeHead(200, { 'Content-type': 'text/json' });
				response.end();
			}
			break;
		case '/handleresponsefrominitxn':
			if (request.method == 'POST') {
				var fullBody = '';
				request.on('data', function (chunk) {
					fullBody += chunk.toString();
				});
				request.on('end', function () {
					var decodedBody = querystring.parse(fullBody);

					console.log(decodedBody);

					// get received checksum
					//var checksum = decodedBody.CHECKSUMHASH;

					// remove this from body, will be passed to function as separate argument
					//delete decodedBody.CHECKSUMHASH;

					response.writeHead(200, { 'Content-type': 'text/html', 'Cache-Control': 'no-cache' });
					// if (paytm_checksum.verifychecksum(decodedBody, paytm_config.MERCHANT_KEY, checksum)) {
					// 	console.log("Checksum Verification => true");
					// 	response.write("Checksum Verification => true");
					// } else {
					// 	console.log("Checksum Verification => false");
					// 	response.write("Checksum Verification => false");
					// }
					// if checksum is validated Kindly verify the amount and status 
					// if transaction is successful 
					// kindly call Paytm Transaction Status API and verify the transaction amount and status.
					// If everything is fine then mark that transaction as successful into your DB.	
					
					


					
					let payemntoutputMessage = "";
					if (decodedBody['STATUS'] === "TXN_SUCCESS") {

						payemntoutputMessage = paymentHTML.replace(/PAYMENTSTATUS/g, JSON.stringify(decodedBody))
							 ;
					} else {
						payemntoutputMessage = JSON.stringify(decodedBody);
					}

					response.writeHead(200, { 'Content-type': 'text/html', 'Cache-Control': 'no-cache' });
					response.write(payemntoutputMessage);
					response.end();


					//response.write(JSON.stringify(decodedBody));
					//response.end();
				});
			} else {
				response.writeHead(200, { 'Content-type': 'text/json' });
				response.end();
			}
			break;

		case '/initiatetransaction':
			if (request.method == 'POST') {
				var fullBody = '';
				request.on('data', function (chunk) {
					fullBody += chunk.toString();
				});
				request.on('end', function () {
					var decodedBody = querystring.parse(fullBody);

					console.log(decodedBody);


					/* initialize an object */
					var paytmParams = {};

					let mid = decodedBody.MID;
					let theORDER_ID = decodedBody.ORDER_ID;

					/* body parameters */
					paytmParams.body = {

						/* for custom checkout value is 'Payment' and for intelligent router is 'UNI_PAY' */
						"requestType": "Payment",

						/* Find your MID in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
						"mid": mid,

						/* Find your Website Name in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys */
						"websiteName": decodedBody.WEBSITE,

						/* Enter your unique order id */
						"orderId": theORDER_ID,

						/* on completion of transaction, we will send you the response on this URL */
						"callbackUrl": decodedBody.CALLBACK_URL,

						/* Order Transaction Amount here */
						"txnAmount": {

							/* Transaction Amount Value */
							"value": decodedBody.TXN_AMOUNT,

							/* Transaction Amount Currency */
							"currency": "INR",
						},

						/* Customer Infomation here */
						"userInfo": {

							/* unique id that belongs to your customer */
							"custId": decodedBody.CUST_ID,
						},
					};



					/**
					* Generate checksum by parameters we have in body
					* Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys 
					*/
					paytm_checksum.genchecksumbystring(JSON.stringify(paytmParams.body), paytm_config.MERCHANT_KEY, function (err, checksum) {

						/* head parameters */
						paytmParams.head = {

							/* put generated checksum value here */
							"signature": checksum
						};

						/* prepare JSON string for request */
						var post_data = JSON.stringify(paytmParams);

						var options = {

							/* for Staging */
							hostname: 'securegw-stage.paytm.in',

							/* for Production */
							// hostname: 'securegw.paytm.in',

							port: 443,
							path: '/theia/api/v1/initiateTransaction?mid=' + mid + '&orderId=' + theORDER_ID,
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								'Content-Length': post_data.length
							}
						};

						// Set up the request
						var lresponse = "";
						var post_req = https.request(options, function (post_res) {
							post_res.on('data', function (chunk) {
								lresponse += chunk;
							});

							post_res.on('end', function () {
								console.log('Response: ', lresponse);
								let parsedResponse = JSON.parse(lresponse);
								console.log('parsedResponse: ------', parsedResponse);
								console.log('Response: ------', parsedResponse.body.txnToken);

								let outputMessage = "";
								if (parsedResponse.body.txnToken.length > 1) {

									outputMessage = initiateHTML.replace(/MID-HERE/g, mid)
										.replace(/ORDERID-HERE/g, theORDER_ID)
										.replace(/TXNTOKEN-HERE/g, parsedResponse.body.txnToken);
								} else {
									outputMessage = "Txn Token Not found";
								}

								response.writeHead(200, { 'Content-type': 'text/html', 'Cache-Control': 'no-cache' });
								response.write(outputMessage);
								response.end();
							});
						});

						// post the data
						post_req.write(post_data);
						post_req.end();
					});


					//response.write(JSON.stringify(decodedBody));
					//response.end();
				});
			} else {
				response.writeHead(200, { 'Content-type': 'text/json' });
				response.end();
			}
			break;
	}
}

function htmlEscape(str) {
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}
exports.route = route;
