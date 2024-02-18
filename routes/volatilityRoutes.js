const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const axios = require('axios');

const fetchStocks = async () => {
  console.info("Parsing current stock data...");
  try {
    const response = await axios.get("https://finance.yahoo.com/most-active/");
    const html = response.data;
    const $ = cheerio.load(html);
    const stockList = [];

    $('tr.simpTblRow').each((index, element) => {
      const symbol = $(element).find('a[data-test="quoteLink"]').text();
      const name = $(element).find('td[aria-label="Name"]').text();
      const price = $(element).find('td[aria-label="Price (Intraday)"] fin-streamer[data-field="regularMarketPrice"]').text();
      const change = $(element).find('td[aria-label="Change"] fin-streamer[data-field="regularMarketChange"]').text();
      const percentChange = $(element).find('td[aria-label="% Change"] fin-streamer[data-field="regularMarketChangePercent"]').text();
      const marketCap = $(element).find('td[aria-label="Market Cap"] fin-streamer[data-field="marketCap"]').text();
      
      stockList.push({ symbol, name, price, change, percentChange, marketCap, bearOrBull: Number(percentChange.replace('%', '')) > 0 ? "Bullish" : "Bearish" });
    });
    console.log("Data parsing complete", stockList);
    return stockList;
  } catch (error) {
    console.error('Failed to fetch or parse stock data:', error);
    throw error;
  }
};

const sortAndFilterStocks = (stocks, type) => {
  return stocks
    .filter(stock => (type === 'bulls' && stock.bearOrBull === "Bullish") || (type === 'bears' && stock.bearOrBull === "Bearish"))
    .sort((a, b) => Number(b.percentChange.replace('%', '')) - Number(a.percentChange.replace('%', '')));
};

router.get('/:type(bulls|bears)', async (req, res) => {
  try {
    const stocks = await fetchStocks();
    const filteredAndSortedStocks = sortAndFilterStocks(stocks, req.params.type);
    res.json(filteredAndSortedStocks);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch active stocks");
  }
});

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
