/**
 * This function was created because web3.eth.sendTransaction returns the hash immediately, which results in the dApp transactions not completing correctly.
 * This waits for the transaction to be mined successfully
 */

export const getTxReceiptMined = (web3, txHash, options) => {
  let interval = options && options.interval ? options.interval : 500
  const transactionReceiptAsync = function (resolve, reject) {
    web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
      if (error) {
        reject(error)
      } else if (receipt == null) {
        setTimeout(
          () => transactionReceiptAsync(resolve, reject),
          interval)
      } else {
        resolve(receipt)
      }
    })
  }

  if (Array.isArray(txHash)) {
    return Promise.all(txHash.map(
      oneTxHash => getTxReceiptMined(web3, oneTxHash, interval)))
  } else if (typeof txHash === 'string') {
    return new Promise(transactionReceiptAsync)
  } else {
    throw new Error('Invalid Type: ' + txHash)
  }
}
