let depmod = require('./src/ContractOps')
new depmod.contract().createAccount()
console.log("Set newly created account in appconfig to userAccount")
console.log("Change genesisAccount1, genesisAccount1 account values in appconfig to match to the existing valid accounts")