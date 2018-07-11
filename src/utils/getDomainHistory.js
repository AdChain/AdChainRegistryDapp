import {registryApiURL} from '../models/urls'
/*
 * Get Domain's History Request
 * Param: listing hash of domain
 * Return domain's history data
*/
export const getDomainHistory = async (listingHash) => {
  let res
  try {
    res = await (await window.fetch(`${registryApiURL}/registry/domain/history?listing_hash=${listingHash}`)).json()
    return res.history
  } catch (error) {
    res = []
    console.log(error)
  }
  return res
}
