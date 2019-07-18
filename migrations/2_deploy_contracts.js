const Medidor = artifacts.require("Medidor");

module.exports = function (deployer) {
  deployer.deploy(Medidor);
};
