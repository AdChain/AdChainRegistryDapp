function string2Bool (obj) {
  if (typeof obj !== 'object') {
    return {}
  }

  for (let k in obj) {
    if (obj[k] === true ||
        obj[k] === 'true' ||
        obj[k] === 1 ||
        obj[k] === 'yes' ||
        obj[k] === 'y'
    ) {
      obj[k] = true
    } else if (
      obj[k] === false ||
      obj[k] === 'false' ||
      obj[k] === 0 ||
      obj[k] === 'no' ||
      obj[k] === 'n' ||
      obj[k] === undefined ||
      obj[k] === null
    ) {
      obj[k] = false
    }
  }

  return obj
}

function normalizeQueryObj (obj) {
  return string2Bool(obj)
}

export default normalizeQueryObj
