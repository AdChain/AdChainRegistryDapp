import axios from 'axios'
const url = 'http://utility.adchain.com/'

export async function getPosts (domain) {
  let res
  try {
    res = await axios.post(`${url}get/post`, {
      domain: domain
    })
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
