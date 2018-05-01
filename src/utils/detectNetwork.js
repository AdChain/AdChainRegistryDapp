
const networksTypes = {
  1: 'main',
  2: 'morden',
  3: 'ropsten',
  42: 'kovan',
  4: 'rinkeby'
}

export const detectNetwork = (provider) => {
  var type = null
  var netId
  try {
    return new Promise(async (resolve, reject) => {
      if (!window.web3) {
        throw new Error('No MetaMask/web3')
      }
      window.web3.version.getNetwork((err, _netId) => {
        if (_netId === undefined) {
          netId = null
        }
        if (err) {
          throw new Error(err)
        }

        netId = _netId
        type = networksTypes[netId] || 'unknown'

        resolve({
          id: netId,
          type: type
        })
      })
    })
  } catch (error) {
    console.log(error)
    return {
      id: netId || 'unknown',
      type: ''
    }
  }
}
