# AltBot Chrome Extension

We created a AltBot Chrome Extension using Manifest V3 specially for the website "Mastodon.social". Our extension adds new alt text to the images directly into the HTML DOM if the original creators did't provide with one.

---

## Install Instruction (Setting up your own python API server) (OPTIONAL: You can skip to next section directly)

1. Create a hugging face access token [here](https://huggingface.co/settings/tokens)

2. Setup a public flask server for our extension to query. (We used pythonanywhere.com to set up on cloud for free)

3. Use the [Demo ML Python file](AltBot_Chrome_Extension_Mastadon\ml_api\demo_ML_Api.py) to host the flask server. 
    Make sure to change the API_Token on line 47, and uname and password on line 15-16.

4. Finally, we need to edit the base_url and creds in the contentScript.js file to call the new Flask API. (Lines: 26, 32, 33)


## Install Instruction (Direct Running)

1. On chrome://extensions/, enable the developer mode.
2. Click `Load unpacked` and select this extension foler.

   <img width="832" alt="image" src="https://github.com/CSE210-Fall23-Team2/AltBot/assets/78366188/95f490ea-cab5-4e8d-afe3-58af16b43580">

3. Enable the extension and navigate to the Mastodon.social website. Upon doing so, you can check if the extension is installed properly by clicking on the extension's logo. A popup window will appear, indicating that our bot is currently running.

   <img width="505" alt="image" src="docs/ExtensionRunning.png">




## Demo

Once running, our bot will automatically detect images and add alt tags to the code if it's not already present.\
You can see the alt tags by hovering over it, or listen to it using a screen reader!\
Example:
<img width="auto" alt="image" src="docs/demo.png">

---

## File Structure

`manifest.json` provide information about our extension

`background.json` Act as the background **service_worker**. If we are navigating mastodon home page, it will trigger our extension functionality.

`popup.html & popup.js & popup.css & utils.js` A simple popup window indicating if our extension is working.

`contentScript.js` Main functionality. Details are shown below.

---

## Functionality

Before exploring the functionalities, let first take a look at mastodon home page structure. When we scrolling on the page back and forth, the DOM structure actively changes. Only the posts visible on the webpage will own the classs name `media-gallery__item-thumbnail`. Our DOM observer, that actively monitors on these changes, will process the alt text fetching/generation for these visible images.

If an image has a alt text, than there will be a `<span>` element inside the `<div class="media-gallery__item__badges">` section for alt text display right after the image element. Our work add such elements for those posted images missing alt text.

Our extension mainly consists of two parts, alt text generation & storage.

- For alt text generation, we host a flask API for alt text generation in _pythonanywhere_ in the cloud. We integrate the huggingface inference API to fetch alt text through HTTP requests (Demo Python File stored inside the ML_api folder).

- To more efficiently retrieving generated alt text, we use two storages: a `local storage` remains active until the page is refreshed or offline and `chrome.storage.local` where storage remained until the extension is removed. We represent each image with its unique image id that is assigned (can be parsed through its `href`) by mastodon and store it with the generated alt text in the two storages.

  For an unseen image, we generate the alt text from our API and then store it to both chrome storage and local one. Otherwise, we will directly get it from local storage if available or fetch from chrome storage. We believe that it guarantees a faster access speed instead of making the identical query again and again.

---

##### Known Limitation/Bug

The API call made to the pythoncode hosted on pythonanywhere is currently only secured by a username password hard coded in the foreground contentScript.js script.\
To fix direct passing of uname and pwd, we need to setup a OAuth authentication like system to give each user their own uname/pwd. Giving a common, even with a .env file can be as easily extracted as being written in the contentScript.js file.\
Unfortunately, no time to do that!
