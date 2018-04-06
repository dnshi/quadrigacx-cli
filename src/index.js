#!/usr/bin/env node

/**
 * Author: Dean Shi <dean.xiaoshi@gmail.com>
 * Date:   2018-02-09
 */

require('colors')

const r2 = require('r2')
const Table = require('cli-table2')
const program = require('commander')

const getBookUrl = (book) => `https://api.quadrigacx.com/v2/ticker?book=${book}`
const getCurrentTradingInformation = (book) => r2(getBookUrl(book)).json
const books = ['btc_cad', 'eth_cad', 'ltc_cad']

program.version(require('../package.json').version).parse(process.argv)

Promise.all(books.map(getCurrentTradingInformation))
  .then((results) => {
    const table = new Table({
      head: ['Coin', 'Price CAD', 'Buy Price', 'Sell Price', 'High', 'Low'].map(
        (title) => title.yellow
      ),
    })

    table.push(
      ...results.map(({ last, bid, ask, high, low }, i) => [
        books[i].replace(/_cad/g, '').toUpperCase(),
        last,
        bid,
        ask,
        high,
        low,
      ])
    )

    console.log()
    console.log(table.toString())
    console.log(
      `Data source from quadrigacx.com at ${
        new Date().toLocaleString().split(', ')[1]
      }`
    )
  })
  .catch((error) => {
    console.error('⚠️  Cannot fetch data'.bold.red)
    console.log(error)
  })
