const fs = require('fs');
let cfg = require('../appconfig')
const account = require('web3-eth-accounts')
const web3 = new (require('web3'))(cfg.appConfig.networkEndpoint)
var Tx = require('ethereumjs-tx').Transaction;

module.exports.contract = class {
    constructor(contractFileName) {
        this.contractFile = contractFileName
        this.contractObject = undefined;

        this.contractWrapper = class {
            constructor(receiver, res, rej) {
                this._receiver = receiver;
                this.res = res;
            }

            fileHandler(e, d) {
                this._receiver.contractObject = JSON.parse(d.toString())
                this.res()
            }
        }
    }

    initContract() {
        return new Promise((resolve, reject) => {
            let r = new this.contractWrapper(this, resolve, reject);
            fs.readFile(this.contractFile, (e, d) => r.fileHandler(e, d))
        })

    }

    async deploy(from) {
        let noceNow = await web3.eth.getTransactionCount(from)
        this.initContract().then(() => {
            let ac = JSON.parse(fs.readFileSync(from).toString())
            let key = Buffer.from(ac.key.slice(2), 'hex');
            let rawTx = {
                from: from,
                gasPrice: 4,
                gas: 3000000,
                nonce: noceNow,
                data: this.contractObject.bytecode
            };

            let tx = new Tx(rawTx);
            tx.sign(key);
            let serializedTx = tx.serialize();
            web3.eth.sendSignedTransaction("0x".concat(serializedTx.toString('hex'))).on('receipt', function (receipt) {
                console.log(receipt)
            }).then((e, r) => {
                //console.log(e, r)
            });
        })
    }

    createAccount() {
        let ac = web3.eth.accounts.create()
        let account = { address: ac.address, key: ac.privateKey }
        fs.writeFile(account.address, JSON.stringify(account))
    }

    async sendFunds(from, to) {
        console.log(to, 'balance before', (await web3.eth.getBalance(to)))

        web3.eth.sendTransaction({
            from: from,
            to: to,
            value: '50000000000000000'
        }).then(async (e, r) => {
            console.log(e, r)
            console.log(to, 'balance after ', (await web3.eth.getBalance(to)))
        });
    }

    async sendMyFunds(from, to) {
        console.log(to, 'balance before', (await web3.eth.getBalance(to)))
        let ac = JSON.parse(fs.readFileSync(from).toString())
        let key = Buffer.from(ac.key.slice(2), 'hex');
        let noceNow = await web3.eth.getTransactionCount(from)
        let rawTx = {
            from: from,
            to: to,
            value: 5000, gasPrice: 4,
            gas: 30000,
            nonce: noceNow
        };

        let tx = new Tx(rawTx);
        tx.sign(key);
        let serializedTx = tx.serialize();
        web3.eth.sendSignedTransaction("0x".concat(serializedTx.toString('hex'))).on('receipt', async function (receipt) {
            console.log(receipt)
            console.log(to, 'balance after', (await web3.eth.getBalance(to)))
        }).then((e, r) => {
            //console.log(e, r)
        });
    }

    async distributeFund(from, to1, to2) {
        let noceNow = await web3.eth.getTransactionCount(from)
        // web3.eth.getAccounts().then((e, d) => {
        //     console.log(e, d)
        // });
        // return;

        // console.log('balance of ' + from + ' is >' + (await web3.eth.getBalance(from)))
        // console.log('balance of ' + to1 + ' is >' + (await web3.eth.getBalance(to1)))
        // console.log('balance of ' + to2 + ' is >' + (await web3.eth.getBalance(to2)))
        // console.log('balance of ' + cfg.appConfig.contract + ' is >' + (await web3.eth.getBalance(cfg.appConfig.contract)))

        this.initContract().then(() => {
            let ac = JSON.parse(fs.readFileSync(from).toString())
            let key = Buffer.from(ac.key.slice(2), 'hex');
            let cobj = this.contractObject
            let contract = new web3.eth.Contract(this.contractObject.abi, cfg.appConfig.contract);
            let rawTx = {
                from: from,
                to: cfg.appConfig.contract,
                gasPrice: 4,
                gas: 3000000,
                nonce: noceNow,
                data: contract.methods.pay(to1, to2).encodeABI(),
                value: 3000
            };

            let tx = new Tx(rawTx);
            tx.sign(key);
            let serializedTx = tx.serialize();
            web3.eth.sendSignedTransaction("0x".concat(serializedTx.toString('hex'))).on('receipt', async function (receipt) {
                // console.log(receipt.logs)
                let eventAbi = cobj.abi[0].inputs
                let sig1 = web3.eth.abi.encodeEventSignature(cobj.abi[0])
                let sig2 = web3.eth.abi.encodeEventSignature(cobj.abi[1])
                let sig3 = web3.eth.abi.encodeEventSignature(cobj.abi[2])
                let eventAbi1 = cobj.abi[1].inputs
                let eventAbi2 = cobj.abi[2].inputs
                let sigabimap = {}
                sigabimap[sig1] = eventAbi
                sigabimap[sig2] = eventAbi1
                sigabimap[sig3] = eventAbi2
                receipt.logs.forEach(r => {
                    console.log(web3.eth.abi.decodeLog(sigabimap[r.topics[0]], r.data, r.topics));
                });
                // console.log('balance of ' + from + ' is >' + (await web3.eth.getBalance(from)))
                // console.log('balance of ' + to1 + ' is >' + (await web3.eth.getBalance(to1)))
                // console.log('balance of ' + to2 + ' is >' + (await web3.eth.getBalance(to2)))
                // console.log('balance of ' + cfg.appConfig.contract + ' is >' + (await web3.eth.getBalance(cfg.appConfig.contract)))

            }).then((e, r) => {
                //console.log(e, r)
            });
        })
    }
}