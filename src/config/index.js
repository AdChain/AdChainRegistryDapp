const addresses = require('./address.json')

const net = 'rinkeby'

export function getAddress (contract) {
  return addresses[net][contract]
}

export const getAbi = async (contract) => {
  const storageKey = `adchain:abi:${contract}`
  const cached = window.sessionStorage.getItem(storageKey)

  try {
    if (cached) {
      return JSON.parse(cached)
    }
  } catch (error) {
    console.error(error)
  }

  const url = 'https://s3-us-west-2.amazonaws.com/adchain-registry-contracts'
  const data = await window.fetch(`${url}/${contract}.json`)
  const json = await data.json()

  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(json))
  } catch (error) {
    console.error(error)
  }

  return json
}

export function getProviderUrl (contract) {
  if (net === 'testrpc') {
    return 'http://localhost:8545'
  } else {
    return `https://${net}.infura.io:443`
  }
}
