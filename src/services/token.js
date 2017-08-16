import store from '../store'

const abi = require('../config/token.json').abi
const addr = '0xd0d6d6c5fe4a677d343cc433536bb717bae167dd'

    const instance = window.web3.eth.contract(abi).at(addr)
    token.balanceof.call(this.state.accounts[0], (error, result) => {
      if (error) {
        return false
      }

      this.setstate({
        adtbalance: result.tonumber()
      })
    })

class TokenService {
  constructor() {
  }
}

export default new TokenService()
