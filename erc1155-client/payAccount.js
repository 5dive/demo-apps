let depmod = require('./src/ContractOps')
let cfg = require('./appconfig')
new depmod.contract().sendFunds(cfg.appConfig.genesisAccount1, cfg.appConfig.userAccount)
