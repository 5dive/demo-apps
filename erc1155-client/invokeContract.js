let depmod = require('./src/ContractOps')
let cfg = require('./appconfig')
new depmod.contract(__dirname.concat('/src/PayAll.json')).distributeFund(cfg.appConfig.userAccount,
    cfg.appConfig.genesisAccount1,
    cfg.appConfig.genesisAccount2);
