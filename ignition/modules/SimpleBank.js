const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SimpleBankModule", (m) => {
    const simpleBank = m.contract("SimpleBank");
    return { simpleBank };
});