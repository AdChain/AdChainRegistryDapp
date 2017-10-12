import contract from 'truffle-contract'
import { getProvider } from '../services/provider'

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

export const getPLCR = async () => {
  const registry = await getRegistry()
  const plcrAddress = await registry.voting.call()
  const plcrArtifact = await getAbi('PLCRVoting')
  const PLCRVoting = contract(plcrArtifact)
  PLCRVoting.setProvider(getProvider())

  return PLCRVoting.at(plcrAddress)
}

export const getParameterizer = async () => {
  const registry = await getRegistry()
  const pAddress = await registry.parameterizer.call()
  const pArtifact = await getAbi('Parameterizer')
  const Parameterizer = contract(pArtifact)
  Parameterizer.setProvider(getProvider())

  return Parameterizer.at(pAddress)
}

