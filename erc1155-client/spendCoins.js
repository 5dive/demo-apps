let depmod = require('./src/ContractOps')
let cfg = require('./appconfig')
new depmod.contract().sendMyFunds(cfg.appConfig.userAccount, cfg.appConfig.genesisAccount2)
