import { randomBytes } from 'crypto'
import BN from 'bn.js'

export function randomSalt () {
  const salt = new BN(`0x${randomBytes(32).toString('hex')}`)
    // console.log('salt.toString(10):', salt.toString(10))
  return salt.toString(10)
}
