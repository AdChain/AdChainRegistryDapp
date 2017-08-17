const abi = require('../config/registry.json').abi

// localhost
const addr = '0x0d54cf095baa55f847e4ff4dc23f5a419268ff74'

class RegistryService {
  constructor () {
    this.registry = null

    this.initContract()
  }

  initContract () {
    if (window.web3) {
      if (!this.registry) {
        this.registry = window.web3.eth.contract(abi).at(addr)
      }
    }
  }

  apply (domain) {
    return new Promise((resolve, reject) => {
      if (!domain) {
        reject(new Error('no domain'))
        return false
      }

      if (window.web3) {
        if (!this.registry) {
          this.initContract()
        }

        this.registry.apply(domain, (error, result) => {
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

export default new RegistryService()
