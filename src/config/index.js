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

module.exports = { getAddress, getAbi }
