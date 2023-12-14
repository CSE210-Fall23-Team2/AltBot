# AltBotService

This is the main Mastadon bot that replies to images with a suggested alt tag for the image, which should help screen readers and Mastadon's search capability alike. The bot will scrape the images without an alt-tag of all the accounts you follow.

We are using the publicly available Mastadon API to communicate and transfer data between our ML model and Mastadon.

## Steps to run

### Background:

Create a SQL database

### Step 1

Create MySQl table with `CREATE TABLE Images(image_id VARCHAR(255) PRIMARY KEY, image_url VARCHAR(255), flag integer, post_id VARCHAR(255),user_id VARCHAR(255),alt_text varchar(255));`

### Step 2

Create a .env file
Add your crendentials to the env file

### Step 3

Please proceed to the readme file of AltTagMLService and run the first 3 steps there. [Link](../ALTTagMLService/README.md)

### Step 4

To directly start the running of the bot, you can execute the **main.sh** bash file.
`./main.sh`

> [!NOTE]
> Incase of error related to permission, make sure to give proper permission by executing `chmod +x main.sh`

## TESTING

Please GOTO the Test folder for testing specific instructions.


## Expect Output
Once the server and client sides are set up, the bot will reply to the original posts (new) that do not have an alt tag on the accounts you follow.
<img width="829" alt="image" src="https://github.com/CSE210-Fall23-Team2/AltBot/assets/34372501/933f82a7-31ee-4f0e-82ab-1696b72a53c5">

