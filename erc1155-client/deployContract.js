let depmod = require('./src/ContractOps')
let cfg = require('./appconfig')

new depmod.contract(__dirname.concat('/src/PayAll.json')).deploy(cfg.appConfig.userAccount)

console.log("Set new contract address in appconfig to contract property")