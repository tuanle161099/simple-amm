const AMM = artifacts.require("amm");

module.exports = function (deployer) {
  deployer.then(async () => {
    try {
      await deployer.deploy(AMM);

      const amm = await AMM.deployed();

      console.log(`AMM deployed at: ${amm.address}`);
    } catch (error) {
      console.log(error);
    }
  });
};
