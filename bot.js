// const Mastodon = require("mastodon-api");
// const fs = require("fs");
// const ENV = require("dotenv");
// ENV.config();

// const M = new Mastodon({
//   client_key: process.env.CLIENT_KEY,
//   client_secret: process.env.CLIENT_SECRET,
//   access_token: process.env.ACCESS_TOKEN,
//   timeout_ms: 60 * 1000,
//   api_url: "https://mastodon.social/api/v1/",
// });

// const params = {
//   //   status: "First post on a Federated network",
// };

// M.post("statuses", params, (error, data) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log(data);
//   }
// });
// M.get("timelines/home", {}).then((resp) =>
//   console.log(resp.data[0]["media_attachments"])
// );

// const listener = M.stream("streaming/user", {
//   access_token: process.env.ACCESS_TOKEN,
// });

// listener.on("message", (msg) => console.log(msg));

// listener.on("error", (err) => console.log(err));

// M.post("media", { file: fs.createReadStream("fedid.png") }).then((resp) => {
//   const id = resp.data.id;
//   M.post("statuses", { status: "#fediverse", media_ids: [id] });
// });

const Mastodon = require("mastodon-api");
const fs = require("fs");
const ENV = require("dotenv");
const axios = require("axios");
ENV.config();

const M = new Mastodon({
  client_key: process.env.CLIENT_KEY,
  client_secret: process.env.CLIENT_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  timeout_ms: 60 * 1000,
  api_url: "https://mastodon.social/api/v1/",
});

function getRandomText() {
  const texts = ["Great image!", "Nice picture!", "Awesome shot!"];
  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex];
}

async function checkAndProcessToots() {
  try {
    const homeTimeline = await M.get("timelines/home");
    if (homeTimeline.data.length > 0) {
      for (let i = 0; i < homeTimeline.data.length; i++) {
        const toot = homeTimeline.data[i];
        if (toot.media_attachments.length > 0) {
          toot.media_attachments.map((val, index) => {
            const hasAlt = val["description"] != null;
            if (!hasAlt) {
              const randomText = getRandomText();
              M.post("media", {
                file: fs.createReadStream(val["url"]),
                description: randomText,
              }).then((resp) => {
                const id = resp.data.id;
                M.post("statuses", { status: "#fediverse", media_ids: [id] });
              });
              console.log("done");
            }
          });
        }
      }
    }
  } catch (error) {
    console.error("Error fetching or processing toots:", error);
  }
}
checkAndProcessToots();

const listener = M.stream("streaming/user", {
  access_token: process.env.ACCESS_TOKEN,
});

listener.on("message", (msg) => {
  console.log(msg.data["media_attachments"]);
  checkAndProcessToots();
});

listener.on("error", (error) => {
  console.error("Stream error:", error);
});
