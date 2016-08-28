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

module.exports = {
  loadAccount,
  loadPayments,
};
