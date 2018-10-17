import axios from 'axios'

export async function estimatedTxTime (gasPrice, gasUsed) {
  let predictArray = await axios.get('https://http://ethgasstation.info/json/predictTable.json')

  for (var i = 0; i < predictArray.length; i++) {
    if (predictArray[i]['gasprice'] === gasPrice) {
      break
    }
  }
  let intercept = 4.2794
  let hpa = 0.0329
  let hgo = -3.2836
  // let wb = -0.0048
  let tx = -0.0004

  let intercept2 = 7.5375
  let hpaCoef = -0.0801
  let txAtAboveCoef = 0.0003
  let highGasCoef = 0.3532
  let sum1
  let sum2

  if (gasUsed > 1000000) {
    sum1 = intercept + (predictArray[i]['hashpower_accepting'] * hpa) + hgo + (predictArray[i]['tx_atabove'] * tx)

    sum2 = intercept2 + (predictArray[i]['hashpower_accepting'] * hpaCoef) + (predictArray[i]['tx_atabove'] * txAtAboveCoef) + highGasCoef
  } else {
    sum1 = intercept + (predictArray[i]['hashpower_accepting'] * hpa) + (predictArray[i]['tx_atabove'] * tx)

    sum2 = intercept2 + (predictArray[i]['tx_atabove'] * txAtAboveCoef) + (predictArray[i]['hashpower_accepting'] * hpaCoef)
  }

  let factor = Math.exp(-1 * sum1)
  let prob = 1 / (1 + factor)
  let minedProb
  if (prob > 0.95) {
    minedProb = 'Very High'
  } else if (prob > 0.9 && prob <= 0.95) {
    minedProb = 'Medium'
  } else {
    minedProb = 'Low'
  }
  let expectedWait = Math.exp(sum2)
  if (expectedWait < 2) {
    expectedWait = 2
  }

  if (gasUsed > 2000000) {
    expectedWait += 100
  }

  let pdValues = [expectedWait, predictArray[i]['hashpower_accepting'], predictArray[i]['tx_atabove'], minedProb]
  let blocksWait = pdValues[0]
  let blockInterval = 13.617346938776
  let txMeanSecs = blocksWait * blockInterval
  txMeanSecs = Number(txMeanSecs.toFixed(0))

  return txMeanSecs
}

// $('form').submit(function (event) {
//   // Error Check
//   if (!$('#gas_used').val()) {
//     $('#gas_used').parent().next('.validation').remove()
//     txGasUsed = 21000
//   } else if ($('#gas_used').val() > 6700000) {
//     if ($('#gas_used').parent().next('.validation').length == 0) {
//       $string = "<div class='validation' style='color:red;margin-bottom: 20px;'>Please enter gas used less than 6,700,000 (block limit)"
//       $('#gas_used').parent().after($string)
//     }
//     event.preventDefault() // prevent form from POST to server
//     $('#gas_used').focus()
//     focusSet = true
//     return;
//   } else {
//     $('#gas_used').parent().next('.validation').remove()
//     txGasUsed = $('#gas_used').val()
//   }
//   // Gas Used Set - Now find Gas Price
//   if ($('#other').prop('checked') === true) {
//     otherGasPrice = $('#oth_val').val()
//     if (!otherGasPrice || otherGasPrice < 0.1) {
//       if ($('#oth_val').parent().next('.validation').length == 0) { // only add if not added
//         $('#oth_val').parent().after("<div class='validation' style='color:red;margin-bottom: 20px;'>Please enter gas price >= 0.1 gwei</div>")
//       }
//       event.preventDefault() // prevent form from POST to server
//       $('#oth_val').focus()
//       focusSet = true
//       return;
//     }
//     else {
//       $('#oth_val').parent().next('.validation').remove()//remove it
//       txGasPrice = $('#oth_val').val()
//     }
//   } else {
//     if ($('#fast').prop('checked') === true) {
//       txGasPrice = 12
//     } else if ($('#avg').prop('checked') === true) {
//       txGasPrice = 8

//     } else if ($('#cheap').prop('checked') === true) {
//       txGasPrice = 8
//     }
//     $('#oth_val').val('')
//     $('#oth_val').parent().next('.validation').remove()
//   }

//   event.preventDefault()
//   txArgs = "Predictions: <small><span style='color:red'> Gas Used = " + txGasUsed + '; Gas Price = ' + txGasPrice + ' gwei</span></small>';
//   $('#txArgs').html(txArgs)

  // hashpower = pdValues[1]
  // txatabove = pdValues[2]
  // minedprob = pdValues[3]
  // console.log(blocksWait)

  // currency = 'usd'
  // console.log(currency)
  // exchangeRate = 0
  // blocksWait = Number(blocksWait.toFixed(1))

  // txFeeEth = txGasPrice / 1e9 * txGasUsed
  // txFeeEth = Number((txFeeEth).toFixed(7))
  // txFeeFiat = txFeeEth * exchangeRate
  // txFeeFiat = Number(txFeeFiat.toFixed(5))

  // $('#meanBlocks').html(blocksWait)
  // $('#hp').html(hashpower)
  // $('#txatabove').html(txatabove)
  // $('#meanSecs').html(txMeanSecs)
  // $('#txEth').html(txFeeEth)
  // if (currency == 'usd') {
  //   string = '$' + txFeeFiat
  //   $('#txFiat').html(string)
  // } else if (currency == 'eur') {
  //   string = '€' + txFeeFiat
  //   $('#txFiat').html(string)
  // } else if (currency == 'cny') {
  //   string = '¥' + txFeeFiat
  //   $('#txFiat').html(string)
  // } else if (currency == 'gbp') {
  //   string = '£' + txFeeFiat
  //   $('#txFiat').html(string)
  // }
// })

  // Curency Support

  // $('#eur').click(function () {
  //   location = 'http://ethgasstation.info/calculatorTxV.php?curr=eur';
  // })

  //             $('#usd').click(function () {
  //   location = 'http://ethgasstation.info/calculatorTxV.php?curr=usd';
  // })

  //             $('#cny').click(function () {
  //   location = 'http://ethgasstation.info/calculatorTxV.php?curr=cny';
  // })

  //             $('#gbp').click(function () {
  //   location = 'http://ethgasstation.info/calculatorTxV.php?curr=gbp';
  // })

  //             $('input.flat').change(function () {
  //   $('input.flat').not(this).prop('checked', false)
  //             })
  // $('#oth_val').change(function () {
  //   $('input.flat').prop('checked', false)
  //                 $('#other').prop('checked', true)
  //             })
  // $('#reset').click(function () {
  //   $('#txatabove').html('')
  //               $('#minedprob').html('')
  //               $('#hp').html('')
  //               $('#meanBlocks').html('')
  //               $('#meanSecs').html('')
  //               $('#txEth').html('')
  //               $('#txFiat').html('')
  //               $('#txArgs').html('Predictions:')
  //               $('#oth_val').parent().next('.validation').remove()
  //               $('#gas_used').parent().next('.validation').remove()
  //             })
