const getDataFromDatabase = require('./ExtractData');
const fs = require('fs');
const client = require('https');

getDataFromDatabase()
    .then((read_data) => {
    read_data.forEach(({ image_id, image_url, flag }) => {
    downloadImage(image_url, `OutputImages/${image_id}.png`)
    .then(console.log)
    .catch(console.error);
        });
    })
    .catch((error) => {
        // Handle errors from the getDataFromDatabase function
        console.error('Error in getDataFromDatabase:', error);
    });

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        client.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                // Consume response data to free up memory
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));

            }
        });
    });
}