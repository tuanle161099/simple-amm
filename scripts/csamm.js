const CSAMM = artifacts.require("CSAMM");

const main = async (cb) => {
  try {
    const accounts = await web3.eth.getAccounts();

    const csamm = await CSAMM.deployed();

    console.log('CSAMM address:', csamm.address);

  } catch(err) {
    console.log('Doh! ', err.message);
  }
  cb();
}

module.exports = main;
