# AltBot

## About

<p class="has-line-data" data-line-start="0" data-line-end="1">Project ALtBot is our final project submission as a part of the course in CSE 210, instructed by Professor Thomas Powell.</p>
<p class="has-line-data" data-line-start="4" data-line-end="5">AltBot is a JavaScript-based bot designed for the Fediverse, specifically Mastodon. It automatically generates Alt Text for images, enhancing accessibility for visually impaired users and connecting them with the vibrant, decentralized world of the Fediverse. This innovative tool exemplifies our commitment to inclusive and advanced technology solutions.</p>
<p class="has-line-data" data-line-start="7" data-line-end="8">The project employs the best software engineering practices recommended by David Farley in his book Modern Software Engineering. Our code uses continuous integration to ensure consistent code quality and early detection of conflicts or issues. The code is appropriately modularized, with concerns separated and exhibiting good cohesion. The project opted not to utilize Test-Driven Development to accommodate the brief development period and the team’s inexperience with TDD.</p>


## Folder Structure

- ALTTagMLService  (Web GUI for AltBot)
  - templates
  - docs
    -  index.html
    -  README.md
  - app.py
  - requirements.txt
  - README.md

- AltBotService (Mastadon Bot)
  - Images
  - docs
  - test
    - DownloadImages.test.js
    - ExtractData.test.js
    - README.md
    - ReadDataTimeline.test.js
    - SaveToDB.test.js
    - UploadImage.test.js
  - .gitignore
  - DeleteOutputImages
    - Delete.js
  - DownloadImages
    - DownloadImages.js
    - ExtractData.js
  - ReadTimeline
    - ReadDataTimeline.js
    - SaveToDB.js
  - UploadImage
    - UploadImage.js
    - dbutil.js
  - jest.config.js
  - main.sh
  - package-lock.json
  - package.json
  - README.md
- AltBot_Chrome_Extension_Mastadon (Chrome Extension)
  - assets
  - ml_api
  - background_svcWorker
    - background.js
  - foreground
    - contentScript.js
  - popUp
    - popup.css
    - popup.js
    - utils.js
  - manifest.json
  - README.md
- Experiment (Standalone Prototypes/Experiementations)
  - archive
  - src

## Design Structure

Our project revolves around a central and pivotal feature: the Alt Bot integrated seamlessly with Mastodon. This serves as the cornerstone of our initiative, providing a robust foundation for enhancing accessibility within the platform. Complementing this mainstay, we've developed a Flask-based web application for alt-text generation and a dedicated alt-text Chrome extension tailored for Mastodon. Together, these components form a comprehensive toolkit, with the Alt Bot at its forefront, championing inclusivity and accessibility across Mastodon's landscape.
****
#### ALTBotService

As a bot account on Mastodon, our operation entails a meticulous process of identifying posts lacking alt text. Upon detection, we promptly generate the necessary alt text and automatically respond to the original posts. Our design primarily revolves around four key components: data retrieval, data storage, data processing, and the reply mechanism.  

##### Data Retrieval

###### ReadDataTimeline.js

We use the mastodon's **home timeline API** to fetch the statuses from the following users. We check the `MediaAttachment` entity to filter the posts with images. If the description doesn't exist for the fetched image, we will store two attributes of each image `id` and `url` in `imageList` that need further alt-text-generation processing. Other modules can retrieve the `imageList` from `getImageList()`.

> `id` The ID of the (image) attachment.
>
> `url`  The location of the original full-size (image) attachment.
>
> `description`  Alternate text that describes what is in the media attachment, to be used for the visually impaired or when media attachments do not load.  



##### Data Storage & Database Structure

###### SaveToDB.js

We store the fetched `imageList` in our database. We use a MySQL database to store the image (`id` & `url`) and a `flag` representing the processed status. The attribute `flag`  is initialized to 0 to indicate unprocessed. We also store user and post information, facilitating tracking for our subsequent reply processes. The database structure is outlined below:

`image_id | image_url | flag | post_id | user_id | alt_text `  



##### Data Processing

`ExtractData.js`  Fetch unprocessed records from the database.

`DownloadImages.js `  Download images from their relevant `url` and save them into the given filepaths (`OutputImages` folder).

`dbutil.js` Helper functions for status flag manipulation and data retrieval from our database.  



##### Replying with ALT text

###### UploadImages.js

For each image that needs to be uploaded, we perform a POST request using Axios to retrieve the generated alt-text from our machine-learning model endpoint in `app.py`. We use node-mastadon API `M.post(path, [params])` to reply to the original post with the image attachment with alt-text.  

> **media API data parameters**
>
> `file` Image file path
>
> `description` Generated alt text
>
> 
>
> **statuses API data parameters** 
>
> `status` "#ALTBOT"
>
> `media_ids[]` Attachment (image) id returned from media API
>
> `in_replay_to_id` postID of which we reply to  


****
#### ALTTagMLServive

We have developed a Flask-based web Application, offering a visual insight into the intricacies of our alt-text generation pipeline.  


****
#### ALTBot Chrome Extension

We've crafted a Chrome Extension that effortlessly automates alt text insertion directly into users' homepages. This thoughtful enhancement not only streamlines the process of creating accessible content but also underscores our commitment to fostering inclusivity within the Mastodon community. 


## Instructions to Run

Each folder's readme explains their respective steps to run.


#### A project by: Shreyas, Niraj, Onkar, Jash, Jay, Eddie, Andrew, Xuanyu
