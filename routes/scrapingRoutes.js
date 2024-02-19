const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const axios = require('axios');

// http://localhost:3000/scrape
const fetchStocks = async () => {
  console.info("Parsing current stock data...");
  try {
    const gainResponse = await axios.get("https://www.tradingview.com/markets/stocks-usa/market-movers-gainers/");
    const lossResponse = await axios.get("https://www.tradingview.com/markets/stocks-usa/market-movers-losers/");
    const html = gainResponse.data + lossResponse.data;
    const $ = cheerio.load(html);
    const stockList = []; // Initialize as an array

    $('.listRow').each((index, element) => {
      const rowKey = $(element).attr('data-rowkey'); // Get the data-rowkey attribute
      const marketSymbolSplit = rowKey.split(':'); // Split the string by ':'
      const market = marketSymbolSplit[0]; // The first element is the market
      const symbol = $(element).find('.tickerNameBox-GrtoTeat').text();
      const name = $(element).find('.tickerNameBox-GrtoTeat').attr('title').split(' − ')[1];
      const price = $(element).find('td.cell-RLhfr_y4.right-RLhfr_y4').eq(1).text().trim();
      let percentChangeElement = $(element).find('.positive-p_QIAEOQ, .negative-p_QIAEOQ').first();
      let percentChangeText = percentChangeElement.text().replace(/−/g, '-'); // Normalize negative sign and extract text
      const percentChangeMatch = percentChangeText.match(/([+-]?\d+(\.\d+)?%)/);
      const percentChange = percentChangeMatch ? percentChangeMatch[0] : "";
      const href = `https://www.tradingview.com/symbols/${market}-${symbol}/`;
      const logo = $(element).find('.tv-circle-logo').attr('src');


      stockList.push({ symbol, name, price, percentChange, href, logo });
    });
    console.log("Data parsing complete", stockList);
    return stockList;
  } catch (error) {
    console.error('Failed to fetch or parse stock data:', error);
    throw error;
  }
};






router.get('/', async (req, res) => {
    try {
        const stocks = await fetchStocks();
        res.json(stocks);
      } catch (err) {
        console.error(err);
        res.status(500).send("Failed to fetch active stocks");
      }
})

module.exports = router;
