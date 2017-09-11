const download = require('download')

async function getContracts () {
  const contracts = {
    token: 'HumanStandardToken',
    plcr: 'PLCRVoting',
    parameterizer: 'Parameterizer',
    registry: 'Registry'
  }

  const baseUrl = 'https://s3-us-west-2.amazonaws.com/adchain-registry-contracts/'
  const outdir = 'src/config'

  for (let key in contracts) {
    var filename = contracts[key]
    var outfilename = `${key}.json`
    var outpath = `${outdir}/${key}.json`
    await download(`${baseUrl}${filename}.json`, outdir, {filename: outfilename})
    console.log(`downloaded ${filename} contract to ${outpath}`)
  }
}

getContracts()
