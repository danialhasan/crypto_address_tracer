export { };

import axios from "axios";
const express = require('express');
const router = express.Router();
const URL: String = "https://api.ethplorer.io";
const testAPIKey: String = 'freekey'
const API_KEY: String = process.env.API_KEY || '';
const method: String = '/getAddressInfo/'

var Web3 = require('web3')
var web3 = require('web3-eth');


/**
 * '' at the end is to tell typescript that the variable could be null, avoiding the
 * error of 'Type 'string | undefined' is not assignable to type 'string''. I need to validate this
 * to make sure it isn't ever actually null.
 * 
 * https://stackoverflow.com/questions/54496398/typescript-type-string-undefined-is-not-assignable-to-type-string
 */
if (API_KEY == '') {
    console.log('API_KEY env variable is equal to null in index.ts')
}

router.get('/', (req:Request, res:any) => {
    res.render('../views/index');
})
router.get('/api', async (req: any, res: any) => {
    let address: String = req.query.address;
    console.log(`Address: ${address}`);

    console.log(`Ether Address: ${address}`);
    await axios({
        method: 'get',
        url: `${URL}${method}${address}/`,
        params: {
            apiKey: API_KEY
        }
    })
        .then((response) => {
            /**
             * NOTE : Apparently the API response is a circular object, which
             * can't be stringified. So, I stringified it with JSON.Stringify and then sent 
             * that with res.send. I don't know if this will cause problems in the future, but in case
             * it does: the alternative is to destructure the object serverside, stringify the deconstructed parts,
             * put them into an array, and then that stringified array will be sent.
             */
            console.log(response)
            response.data.statusCode = 200
            response.data.statusText = 'Address found!'
            console.log(response.data)
            res.send(JSON.stringify(response.data))
        })
        .catch((err) => {
        console.log(`ERROR: Status Code ${err.response.status}`);
        console.log(`Status Text: ${err.response.statusText}`);

            let errorObject = {
                statusCode: err.response.status,
                statusText: err.response.statusText
            }

            if (err.response.status == '406') {
                res.send(errorObject);
            }
        })
})

module.exports = router