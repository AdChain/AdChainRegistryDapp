import { registryApiURL } from '../models/urls'

export const _getDomainsData = async (query) => {
  try {
    console.log('Q: ', query)
    let domainsData = await (await window.fetch(`${registryApiURL}/registry/domains?${query}`)).json()
    if (!Array.isArray(domainsData)) {
      domainsData = []
    }
    return domainsData
  } catch (error) {
    console.log(error)
  }
}
