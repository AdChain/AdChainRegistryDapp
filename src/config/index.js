const addresses = require('./address.json')

/*
TODO: fetch from
https://s3-us-west-2.amazonaws.com/adchain-registry-contracts/Registry.json
https://s3-us-west-2.amazonaws.com/adchain-registry-contracts/Parameterizer.json
https://s3-us-west-2.amazonaws.com/adchain-registry-contracts/HumanStandardToken.json
*/

const net = 'rinkeby'

function getAddress (contract) {
  return addresses[net][contract]
}

function getAbi (contract) {
  return require(`./${contract}.json`).abi
}

function getProviderUrl (contract) {
  if (net === 'testrpc') {
    return 'http://localhost:8545'
  } else {
    return `https://${net}.infura.io:443`
  }
}

module.exports = { getAddress, getAbi, getProviderUrl }
