import request from 'superagent';
import StellarSdk from 'stellar-sdk';
import toml from 'toml';

StellarSdk.Network.useTestNetwork();

const server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

const loadAccount =
  (accountId) => new Promise((resolve, reject) =>
    server
      .accounts()
      .accountId(accountId)
      .call()
      .then(accountResult => resolve({
        balances: accountResult.balances,
        sequence: accountResult.sequence,
      }))
      .catch(err => reject(err))
  );

const loadPayments = (accountId) => new Promise((resolve, reject) =>
  server
    .payments()
    .forAccount(accountId)
    .order('desc')
    .call()
    .then(payments => resolve(payments.records))
    .catch(err => reject(err))
);

const trust = (currencyCode, maxTrust, issuer, stellarKeys) => new Promise((resolve, reject) => {
  server
    .accounts()
    .accountId(stellarKeys.accountId)
    .call()
    .then(account => {
      const userAccount = new StellarSdk.Account(stellarKeys.accountId, account.sequence);
      const transaction = new StellarSdk.TransactionBuilder(userAccount)
        .addOperation(StellarSdk.Operation.changeTrust({
          asset: new StellarSdk.Asset(currencyCode, issuer),
          limit: maxTrust,
        }))
        .build();
      transaction.sign(StellarSdk.Keypair.fromSeed(stellarKeys.secret));

      return server.submitTransaction(transaction)
          .then(transactionResult => resolve(transactionResult))
          .catch(err => reject(err));
    })
    .catch(err => reject(err));
});

const pay = (destination, currency, currencyIssuer, amount, stellarKeys) => new Promise((resolve, reject) => {
  server
    .accounts()
    .accountId(stellarKeys.accountId)
    .call()
    .then(account => {
      const userAccount = new StellarSdk.Account(stellarKeys.accountId, account.sequence);
      const transaction = new StellarSdk.TransactionBuilder(userAccount)
        .addOperation(StellarSdk.Operation.payment({
          destination,
          asset: new StellarSdk.Asset(currency, currencyIssuer),
          amount: amount.toString(),
        }))
        .build();
      transaction.sign(StellarSdk.Keypair.fromSeed(stellarKeys.secret));
      return server.submitTransaction(transaction)
          .then(transactionResult => resolve(transactionResult))
          .catch(err => reject(err));
    })
    .catch(err => reject(err));
});

const fedLookup = (name) => new Promise((resolve, reject) => {
  const hostname = name.split('*')[1];
  return request
    .get(`https://${hostname}/.well-known/stellar.toml`)
    .end((err, resp) => {
      if (err) {
        reject(err);
      }
      const configJSON = toml.parse(resp.text);
      const fedServer = configJSON.FEDERATION_SERVER;
      return request
        .get(`${fedServer}?q=${name}&type=name`)
        .type('text/plain')
        .end((error, response) => {
          if (error) {
            reject(error);
          }

          if (!response.body.account_id) {
            reject();
          }

          resolve(response.body.account_id);
        });
    });
});


module.exports = {
  fedLookup,
  pay,
  trust,
  loadAccount,
  loadPayments,
};
