const abi = require('../config/token.json').abi

// prod
//const addr = '0xd0d6d6c5fe4a677d343cc433536bb717bae167dd'

// localhost
const addr = '0x343c82f96358e0bac16845fb718ea1d44e107270'

class TokenService {
  constructor () {
    this.token = null
    this.decimals = null
    this.name = null
    this.symbol = null

    this.initContract()
  }

  initContract () {
    if (window.web3) {
      if (!this.token) {
        this.token = window.web3.eth.contract(abi).at(addr)

        this.getDecimals()
        this.getName()
        this.getSymbol()
      }
    }
  }

  getName () {
    return new Promise((resolve, reject) => {
      if (window.web3) {
        if (!this.token) {
          this.initContract()
        }

        this.token.name.call((error, result) => {
          if (error) {
            reject(error)
            return false
          }

          this.name = result

          resolve(result)
        })
      } else {
        reject(new Error('no web3'))
      }
    })
  }

  getSymbol () {
    return new Promise((resolve, reject) => {
      if (window.web3) {
        if (!this.token) {
          this.initContract()
        }

        this.token.symbol.call((error, result) => {
          if (error) {
            reject(error)
            return false
          }

          this.symbol = result

          resolve(result)
        })
      } else {
        reject(new Error('no web3'))
      }
    })
  }

  getDecimals () {
    return new Promise((resolve, reject) => {
      if (window.web3) {
        if (!this.token) {
          this.initContract()
        }

        this.token.decimals.call((error, result) => {
          if (error) {
            reject(error)
            return false
          }

          this.decimals = result.toNumber()

          resolve(result)
        })
      } else {
        reject(new Error('no web3'))
      }
    })
  }

  balanceOf (account) {
    return new Promise((resolve, reject) => {
      if (!account) {
        reject(new Error('no account'))
        return false
      }

      if (window.web3) {
        if (!this.token) {
          this.initContract()
        }

        this.token.balanceOf.call(account, (error, result) => {
          if (error) {
            reject(error)
            return false
          }

          const balance = result.toNumber() / Math.pow(10, this.decimals)

          resolve(balance)
        })
      } else {
        reject(new Error('no web3'))
      }
    })
  }

  approve (sender, value=0) {
    return new Promise((resolve, reject) => {
      if (!sender) {
        reject(new Error('no sender'))
        return false
      }

      if (window.web3) {
        if (!this.token) {
          this.initContract()
        }

        this.token.approve(sender, value, (error, result) => {
          if (error) {
            reject(error)
            return false
          }

          resolve(result)
        })
      } else {
        reject(new Error('no web3'))
      }
    })
  }
}

export default new TokenService()
