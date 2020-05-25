Live Demo

https://node-paytm-checksum.herokuapp.com/
[https://node-paytm-checksum.herokuapp.com/](https://node-paytm-checksum.herokuapp.com/)

-----------------------------------------------------
       **generate_checksum**
                    paramarray['MID']  
					paramarray['ORDER_ID']  
					paramarray['CUST_ID']  
					paramarray['INDUSTRY_TYPE_ID']  
					paramarray['CHANNEL_ID']  
					paramarray['TXN_AMOUNT']  
					paramarray['WEBSITE']  
					paramarray['CALLBACK_URL']  
					paramarray['EMAIL']  
					paramarray['MOBILE_NO']  
                    
                    http://localhost:5000/generate_checksum
                    MID:ppTtAL55993483278240
                    TXN_AMOUNT:185.00
                    CALLBACK_URL:http://localhost:5000/handleresponsefrominitxn
                    ORDER_ID:1247
                    CHANNEL_ID:WAP
                    INDUSTRY_TYPE_ID:Retail
                    WEBSITE:WEBSTAGING
                    CUST_ID:3342
                    EMAIL:abc@gmail.com
                    MOBILE_NO:3443432432
                     

        **verify_checksum**
        above + CHECKSUMHASH
        http://localhost:5000/verify_checksum
        CHECKSUMHASH:"4WdTl6FqVcGkmXtM8eRv65yYJzDeQVgrAn+3m9nPA+hocsK5g1xFd4X6RtrVd8Xas+1jlpgWs0kYhJyIcm0QKs/BU8eD5dWxWkkGX6dRnsY="
        MID:ppTtAL55993483278240
        TXN_AMOUNT:185.00
        CALLBACK_URL:http://localhost:5000/handleresponsefrominitxn
        ORDER_ID:1247
        CHANNEL_ID:WAP
        INDUSTRY_TYPE_ID:Retail
        WEBSITE:WEBSTAGING
        CUST_ID:3342
        EMAIL:abc@gmail.com
        MOBILE_NO:3443432432


        **initiatetransaction**
        MID
        ORDER_ID
        WEBSITE
        CALLBACK_URL
        TXN_AMOUNT
        CUST_ID
                http://localhost:5000/initiatetransaction
                MID:ppTtAL55993483278240
                TXN_AMOUNT:185.00
                CALLBACK_URL:http://localhost:5000/handleresponsefrominitxn
                ORDER_ID:1251
                //CHANNEL_ID:WAP
                //INDUSTRY_TYPE_ID:Retail
                WEBSITE:WEBSTAGING
                CUST_ID:3342
                //EMAIL:abc@gmail.com
                //MOBILE_NO:3443432432
                //requestType:UNI_PAY

        **handleresponsefrominitxn**


**FOR PROD--**
change ids in config file paytme config.
prod url in router.js for initiatetransaction
also change paytm keys in all the requests.
always change order id or simply increment it.

 

 **Steps to integrate Paytm in website-**
 1. create testing keys from paytm
 2. add them in node js paytm config file.
 3. also add keys in all requests.
 4. push node code to server.
 5. in this router js file --
   we can 
   generate_checksum
   verify_checksum
   initiatetransaction from web using provided test.html
6. for prod - verify all keys in node code and all the requests.
7. in initiatetransaction - don't forget to change url to prod .

