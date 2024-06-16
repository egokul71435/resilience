const cheerio = require('cheerio');
const axios = require('axios');
const notifier = require('node-notifier');

const url = 'https://www.amazon.com/Panasonic-Headphones-RP-HJE120-K-Ergonomic-Comfort-Fit/dp/B003EM8008/'; // Replace with the actual URL
const checkInterval = 60 * 60 * 1000; // Check every 1 hour (in milliseconds)
let previousPrice = Infinity; // Initialize with a high value

async function checkPrice() {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const priceElement = $('span.aok-offscreen');
    const priceText = priceElement.text().trim();

    const price = parseFloat(priceText.replace('$', ''));

    if (price < previousPrice) {
      console.log(`Price decreased from $${previousPrice} to $${price}`);
      sendNotification(price);
      previousPrice = price;
    } else {
      console.log(`Price remains the same at $${price}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function sendNotification(price) {
  notifier.notify({
    title: 'Price Drop Alert',
    message: `The price has dropped to $${price}. Check it out now!`,
    sound: true,
    wait: true,
  });
}

// Start the price checking process
checkPrice();
setInterval(checkPrice, checkInterval);