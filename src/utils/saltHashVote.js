import {soliditySHA3} from 'ethereumjs-abi'

function saltHashVote (vote, salt) {
  return `0x${soliditySHA3(['uint', 'uint'],
    [vote, salt]).toString('hex')}`
}

export default saltHashVote
