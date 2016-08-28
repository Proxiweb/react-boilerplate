import StellarSdk from 'stellar-sdk';
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


module.exports = {
  pay,
  trust,
  loadAccount,
  loadPayments,
};
