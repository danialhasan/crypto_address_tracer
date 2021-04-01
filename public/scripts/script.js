console.log("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");

let devmode = true
let tokensExist = true;
const darkModeButton = document.getElementById('darkMode');
const lightModeButton = document.getElementById('lightMode');
const changeViewingMode = document.getElementById('changeViewingMode');
const header = document.getElementById('mainPageHeader');
const body = document.querySelector('body');
const addressInput = document.getElementById("addressInput");
const submitBtn = document.getElementById("submitBtn");
const addressInfoBoxTemplate = document.getElementById("addressInfoBoxTemplate");
const token_collection_box_template = document.getElementById("token_collection_box_template");
const background_image_desktop = document.getElementById("background_image_desktop");
const background_image_mobile = document.getElementById("background_image_mobile");
const headerContainer = document.getElementById("headerContainer");
const templateContainer = document.getElementById("templateContainer");
const errorElement = document.getElementById("errorElement");
const tokenTemplate = document.getElementById("tokenTemplate");

if (devmode) addressInput.value = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'

changeViewingMode.addEventListener('click', () => {
    //todo: add dynamic dark/light mode based on system preferences
    if (!darkModeButton.classList.contains('hidden'))
        darkMode();
    else if (!lightModeButton.classList.contains('hidden'))
        lightMode(); //single line if statement 😎
});

window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', event => {
        if (event.matches)
            darkMode();
        else
            lightMode();
    });

function darkMode() {
    body.classList.toggle('bg-black');
    darkModeButton.classList.toggle('hidden');
    lightModeButton.classList.toggle('hidden');
    header.classList.toggle('text-white');
    errorElement.children[0].classList.replace('text-black', 'text-white')
}

function lightMode() {
    body.classList.toggle('bg-black');
    darkModeButton.classList.toggle('hidden');
    lightModeButton.classList.toggle('hidden');
    header.classList.toggle('text-white');
    errorElement.children[0].classList.replace('text-black', 'text-white')
}
/**
 * TODO:
 * take an input from the user (raw hex addresses for now)
 * send it to the API
 * destructure the response and console log it.
 * 
 * Figure out how to take ENS addresses and convert them to hex. Then, submit to API.
 */
addressInput.addEventListener("keyup", function (e) {
    // Number 13 is the "Enter" key on the keyboard
    if (e.key === 'Enter') {
        // Cancel the default action, if needed
        e.preventDefault();
        // Trigger the button element with a click
        submitBtn.click();
        console.log('enter key pressed!');
    }
});
submitBtn.addEventListener('click', async () => {

    let input = addressInput.value;
    console.log(input)
    if (input == '' || input == null) {
        console.log('ERROR: Input field is empty. ');
        return
    }
    try {
        const response = await axios.get('/api', {
            params: {
                address: input
            }
        });
        var { //'var' instead of 'let', to not limit scope to this 'try' block
            address,
            ETH, // All address return 0 ETH when on the test net!
            countTxs,
            tokens
        } = response.data;
        if (tokens == null) {
            tokensExist = false;
            console.log("no tokens on this address.")
        } else {
            tokensExist = true
        }
        // Now: shift elements and display info.

        addressInput.classList.toggle('hidden');
        submitBtn.classList.toggle('hidden');
        headerContainer.classList.replace('mt-40', 'mt-20'); //move header up, phones
        headerContainer.classList.replace('md:mt-64', 'md:mt-16'); //move header up, ipads
        headerContainer.classList.replace('xl:mt-56', 'xl:mt-44'); //move header up, desktops
        // background_image_mobile.classList.remove('absolute', 'bottom-0');
        // background_image_desktop.classList.remove('absolute', 'bottom-0');
        // Uncomment these two background images when you add the token functionality back in

    } catch (error) {
        console.log(`ERROR: ${error}`);
        errorElement.firstChild.classList.toggle('hidden')
    }

    /**
     * Instead of body.append, which appends the node to the bottom of the DOM and 
     * places the element below the background image, I should append it to something that 
     * precedes the background images to make sure they stay at the bottom of the page. 
     */
    for (let i = 0; i < 3; i++) {
        var addressInfoBoxClone = addressInfoBoxTemplate.content.cloneNode(true)
        switch (i) {
            case 0:
                addressInfoBoxClone.children[0].children[0].children[0].textContent = 'ADDRESS';
                addressInfoBoxClone.children[0].children[1].children[0].textContent = minifyAddress(address);
                templateContainer.append(addressInfoBoxClone)
                break;
            case 1:
                addressInfoBoxClone.children[0].children[0].children[0].textContent = 'ENS'
                addressInfoBoxClone.children[0].children[1].children[0].textContent = 'COMING SOON'
                templateContainer.append(addressInfoBoxClone)
                break;
            case 2:
                addressInfoBoxClone.children[0].children[0].children[0].textContent = 'BALANCE'
                addressInfoBoxClone.children[0].children[1].children[0].textContent = ETH.balance
                templateContainer.append(addressInfoBoxClone)
                break;
        }
    }

    templateContainer.append(token_collection_box_template.content.cloneNode(true));
    // The following declarations are here, and not in the first variable declaration block,
    // because they resort to null if token_collection_box_template isn't appended
    // to the DOM by the time they're declared. 
    const token_collection_box = document.getElementById("token_collection_box");
    const tokenContainer = document.getElementById("tokenContainer");
    const collectionsButton = token_collection_box.children[0];
    const tokensButton = token_collection_box.children[1];
    const noTokensError = document.getElementById("noTokensError");

    tokensButton.addEventListener('click', () => {
        if (!tokensExist) {
            tokenContainer.append(noTokensError.content.cloneNode(true));
            return
        }
        // change button styling, then change tokenContainer inner content.
        tokensButton.classList.add('bg-gray-700', 'text-white');
        tokensButton.id = 'selected'
        collectionsButton.classList.remove('bg-gray-700', 'text-white');
        collectionsButton.id = ''

        /**
         * I need to find a way to load all the token elements before they are placed in here. I'll loop
         * through the fetched information to create the elements using the token template, but I am 
         * anticipating the fetching of images and such to take a second or two. I'll display a loading animation
         * until the data is ready.
         * 
         * What I probably should do, is fetch all the token images from the CMC api. I could do that with their map,
         * and just sift through that without using extra API calls. Then, I can just pick the token I need from the map
         * and then use the given images. I should try and use local storage/session storage to store images and data so I 
         * don't have to fetch as much data. 
         */

        showTokens(tokens, tokenContainer);

    })
    collectionsButton.addEventListener('click', () => {
        // change button styling, then change tokenContainer inner content.

        collectionsButton.classList.add('bg-gray-700', 'text-white');
        collectionsButton.id = 'selected'
        tokensButton.classList.remove('bg-gray-700', 'text-white');
        tokensButton.id = ''
        // console.log('clicked!')
    })

});

function showTokens(tokens, tokenContainer) {

    console.log(tokens);

    for (let i = 0; i < tokens.length; i++) {
        var tokenClone = tokenTemplate.content.cloneNode(true); //problem is likely here. Hovering over returns 'any' type.

        /**
         * This function loops through all the tokens in the array, clones
         * the display token template, fills in the template information with 
         * real information from the token array index, and then appends it to the tokenContainer container.
         * 
         * NOTE: We're defeating the const-block-scope of tokenContainer by running it through to our
         * function via argument. I don't know if that's bad programming or not. 
         * NOTE: We're gonna need another API for the metadata of the tokens we get. This is because
         * we need a logo for each token. Ethplorer doesn't supply metadata but CMC does. 
         */


        //NOTE: I tried assigning these element values to their own variables, but it didn't work for some reason.
        //This was the only solution that worked.
        tokenClone.children[0].children[0].children[0].children[0].src = "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png";
        tokenClone.children[0].children[0].children[0].children[1].children[0].textContent = tokens[i].tokenInfo.symbol;
        tokenClone.children[0].children[0].children[0].children[1].children[1].textContent = tokens[i].tokenInfo.name;
        tokenClone.children[0].children[0].children[1].children[0].textContent = tokens[i].balance;

        tokenContainer.append(tokenClone);
        console.log(`Loop iteration ${i + 1}`);
    }
}

function minifyAddress(string) {
    /**
     * What this function does: 
     * keep first 4 letters
     * keep last 4
     * flip order of last 4
     * replace everything in between with '...'
     */
    string = string.split('');
    let newString = '';
    for (let i = 0; i < 4; i++) {
        newString += string[i]
    }
    newString += '...'
    for (let j = 0; j < 4; j++) {
        newString += string[string.length - j - 1]
    }
    newString = newString.split('...');

    let reversedFourLetters = newString[1].split('').reverse();

    newString[1] = reversedFourLetters.join("");
    newString[0] += '...';
    newString = newString.join('');

    return newString
}
const minifyBalance = (balance, amount) => {
    /**
     * Two functionalities:
     *      1. Balance has too many decimals (7.29280289374823897234)
     *      2. Balance has too many digits (788238978912897889123)
     * 
     * If there are too many decimals, return balance.toFixed(amount)
     * Else, if there are too many digits, return the balance in scientific notation. 
     * 
     * In both cases, allow the user to click/hover and see the true unformatted balance.
     * 
     * 
     * ALGORITHM:
     * 1. Count the number of characters in the first half of the array.If it is greater than 5, convert it to scientific *
         notation and return that.
     * 2. array.split(".") and count the character length for the string in the latter half of the array, after "." 
     *    If greater than 5, use toFixed to cap it off to 5 decimal places.
     *      - if number is 123.456, returns ['123','456'], see if array[1] character count > 3. If so, cap it off.
     */
}