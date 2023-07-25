const Token1 = artifacts.require("Token1");
const Token2 = artifacts.require("Token2");

module.exports = function (deployer) {
  deployer.deploy(Token1);
  deployer.deploy(Token2);
};
