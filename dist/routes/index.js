"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const express = require('express');
const router = express.Router();
const URL = "https://api.ethplorer.io";
const testAPIKey = 'freekey';
const API_KEY = process.env.API_KEY || '';
const method = '/getAddressInfo/';
var Web3 = require('web3');
var web3 = require('web3-eth');
/**
 * '' at the end is to tell typescript that the variable could be null, avoiding the
 * error of 'Type 'string | undefined' is not assignable to type 'string''. I need to validate this
 * to make sure it isn't ever actually null.
 *
 * https://stackoverflow.com/questions/54496398/typescript-type-string-undefined-is-not-assignable-to-type-string
 */
if (API_KEY == '') {
    console.log('API_KEY env variable is equal to null in index.ts');
}
router.get('/', (req, res) => {
    res.render('../views/index');
});
router.get('/api', async (req, res) => {
    let address = req.query.address;
    console.log(address);
    //todo: we must take this address, and check to see what it's hex is in case
    //it is ENS. After that, we take the hex ENS and plug it into the await axios function below. 
    /**
     * I have spent a whole day on the ENS->Address problem. I have not found a solution that works yet. I am going to
     * push the feature later down the timeline and work on displaying information for now.
     */
    console.log(`Ether Address: ${address}`);
    await axios_1.default({
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
        console.log(response);
        res.send(JSON.stringify(response.data));
    })
        .catch((err) => {
        console.log(`ERROR: Status Code ${err.response.status}`);
        console.log(`Status Text: ${err.response.statusText}`);
    });
});
module.exports = router;
