import request from 'superagent';
import StellarSdk from 'stellar-sdk';
import toml from 'toml';

const getServer = (env) => {
  switch (env) {
    case 'test':
      StellarSdk.Network.useTestNetwork();
      return new StellarSdk.Server('https://horizon-testnet.stellar.org');
    case 'public':
    default:
      StellarSdk.Network.usePublicNetwork();
      return new StellarSdk.Server('https://horizon.stellar.org');
  }
};

const loadAccount =
  (env, accountId) => new Promise((resolve, reject) =>
    getServer(env)
      .accounts()
      .accountId(accountId)
      .call()
      .then((accountResult) => resolve({
        balances: accountResult.balances,
        sequence: accountResult.sequence,
      }))
      .catch((err) => reject(err))
  );

const loadPayments = (env, accountId, limit = 10) => new Promise((resolve, reject) =>
  getServer(env)
    .payments()
    .forAccount(accountId)
    .order('desc')
    .limit(limit)
    .call()
    .then((payments) => resolve(payments.records))
    .catch((err) => reject(err))
);

const trust = (env, currencyCode, maxTrust, issuer, stellarKeys) => new Promise((resolve, reject) => {
  getServer(env)
    .accounts()
    .accountId(stellarKeys.accountId)
    .call()
    .then((account) => {
      const userAccount = new StellarSdk.Account(stellarKeys.accountId, account.sequence);
      const transaction = new StellarSdk.TransactionBuilder(userAccount)
        .addOperation(StellarSdk.Operation.changeTrust({
          asset: new StellarSdk.Asset(currencyCode, issuer),
          limit: maxTrust,
        }))
        .build();
      transaction.sign(StellarSdk.Keypair.fromSeed(stellarKeys.secret));

      return getServer(env).submitTransaction(transaction)
          .then((transactionResult) => resolve(transactionResult))
          .catch((err) => reject(err));
    })
    .catch((err) => reject(err));
});

const pay = (env, destination, currency, currencyIssuer, amount, stellarKeys) => new Promise((resolve, reject) => {
  getServer(env)
    .accounts()
    .accountId(stellarKeys.accountId)
    .call()
    .then((account) => {
      const userAccount = new StellarSdk.Account(stellarKeys.accountId, account.sequence);
      const transaction = new StellarSdk.TransactionBuilder(userAccount)
        .addOperation(StellarSdk.Operation.payment({
          destination,
          asset: new StellarSdk.Asset(currency, currencyIssuer),
          amount: amount.toString(),
        }))
        .build();
      transaction.sign(StellarSdk.Keypair.fromSeed(stellarKeys.secret));
      return getServer(env).submitTransaction(transaction)
          .then((transactionResult) => resolve(transactionResult))
          .catch((err) => reject(err));
    })
    .catch((err) => reject(err));
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
