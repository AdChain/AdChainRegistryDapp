import contract from 'truffle-contract'
const addresses = require('./address.json')

const net = 'rinkeby'

export function getAddress (contract) {
  return addresses[net][contract]
}

export const getProvider = () => {
  if (window.web3) {
    return window.web3.currentProvider
  } else {
    const provider = new window.Web3.providers.HttpProvider(getProviderUrl())
    return provider
  }
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

export const getRegistry = async () => {
  const registryArtifact = await getAbi('Registry')
  const Registry = contract(registryArtifact)
  Registry.setProvider(getProvider())

  return Registry.deployed()
}

export const getToken = async () => {
  const registry = await getRegistry()
  const tokenAddress = await registry.token.call()
  const tokenArtifact = await getAbi('HumanStandardToken')
  const Token = contract(tokenArtifact)
  Token.setProvider(getProvider())

  return Token.at(tokenAddress)
}

export function getProviderUrl (contract) {
  if (net === 'testrpc') {
    return 'http://localhost:8545'
  } else {
    return `https://${net}.infura.io:443`
  }
}
