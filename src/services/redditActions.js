import axios from 'axios'
// const url = 'https://utility.adchain.com/'
// second server = https://utility2.adchain.com/
const url = 'https://utility-staging.adchain.com/' // staging

export async function getPosts (domain) {
  let res
  try {
    res = await axios.post(`${url}get/post`, {
      domain: domain
    })
    console.log('result: ', res)
    return res
  } catch (error) {
    console.error(error)
  }
}

export async function createPostApplication (domain, reason) {
  let res
  try {
    res = await axios.post(`${url}create/post/application`, {
      domain: domain,
      reason: reason
    })
    return res
  } catch (error) {
    console.error(error)
  }
}

export async function createPostChallenge (domain, reason) {
  let res
  try {
    res = await axios.post(`${url}create/post/challenge`, {
      domain: domain,
      reason: reason
    })
    return res
  } catch (error) {
    console.error(error)
  }
}

export async function createComment (id, comment) {
  let res
  try {
    res = await axios.post(`${url}create/comment`, {
      id: id,
      comment: comment
    })
    return res
  } catch (error) {
    console.error(error)
  }
}
