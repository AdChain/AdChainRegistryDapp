import pify from 'pify'

const {token:address} = require('../config/address.json')
const abi = require('../config/token.json').abi

class TokenService {
  constructor () {
    this.address = address
    this.token = null
    this.decimals = null
    this.name = null
    this.symbol = null

    this.initContract()
  }

  initContract () {
    if (!window.web3) {
      return false
    }

    if (!this.token) {
      this.token = window.web3.eth.contract(abi).at(this.address)

      this.getDecimals()
      this.getName()
      this.getSymbol()
    }
  }

  getName () {
    return new Promise(async (resolve, reject) => {
      if (!this.token) {
        this.initContract()
      }

      const name = await pify(this.token.name.call)()
      this.name = name

      resolve(name)
    })
  }

  getSymbol () {
    return new Promise(async (resolve, reject) => {
      if (!this.token) {
        this.initContract()
      }

      const symbol = await pify(this.token.symbol.call)()

      this.symbol = symbol

      resolve(symbol)
    })
  }

  getDecimals () {
    return new Promise(async (resolve, reject) => {
      if (!this.token) {
        this.initContract()
      }

      const result = await pify(this.token.decimals.call)()

      this.decimals = result.toNumber()

      resolve(this.decimals)
    })
  }

  balanceOf (account) {
    return new Promise(async (resolve, reject) => {
      if (!account) {
        reject(new Error('Account is required'))
        return false
      }

      if (!this.token) {
        this.initContract()
      }

      const result = await pify(this.token.balanceOf.call)(account)

      const balance = result.toNumber() / Math.pow(10, this.decimals)

      resolve(balance)
    })
  }

  async approve (sender, value=0) {
    return new Promise(async (resolve, reject) => {
      if (!sender) {
        reject(new Error('Sender is required'))
        return false
      }

      if (!this.token) {
        this.initContract()
      }

      const result = await pify(this.token.approve)(sender, value)

      resolve(result)
    })
  }
}

export default new TokenService()
