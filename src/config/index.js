const addresses = require('./address.json')

const net = 'rinkeby'

export function getAddress (contract) {
  return addresses[net][contract]
}

export const getAbi = async (contract) => {
  const url = 'https://s3-us-west-2.amazonaws.com/adchain-registry-contracts'
  const data = await fetch(`${url}/${contract}.json`)
  const json = await data.json()
  return json
}

export function getProviderUrl (contract) {
  if (net === 'testrpc') {
    return 'http://localhost:8545'
  } else {
    return `https://${net}.infura.io:443`
  }
}
