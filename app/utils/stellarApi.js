import request from "superagent";
import StellarSdk from "stellar-sdk";
import toml from "toml";

const getServer = () => {
  switch (process.env.NODE_ENV) {
    case "production":
      StellarSdk.Network.usePublicNetwork();
      return new StellarSdk.Server("https://horizon.stellar.org"); // -testnet
    case "development":
    default:
      StellarSdk.Network.usePublicNetwork();
      return new StellarSdk.Server("https://horizon.stellar.org");
  }
};

const loadAccount = accountId =>
  new Promise((resolve, reject) =>
    getServer()
      .accounts()
      .accountId(accountId)
      .call()
      .then(accountResult =>
        resolve({
          balances: accountResult.balances,
          sequence: accountResult.sequence
        })
      )
      .catch(err => reject(err))
  );

const loadPayments = (accountId, limit = 10) =>
  new Promise((resolve, reject) =>
    getServer()
      .payments()
      .forAccount(accountId)
      .order("desc")
      .limit(limit)
      .call()
      .then(payments => resolve(payments.records))
      .catch(err => reject(err))
  );

const loadEffects = (accountId, limit = 10) =>
  new Promise((resolve, reject) =>
    getServer()
      .effects()
      .forAccount(accountId)
      .order("desc")
      .limit(limit)
      .call()
      .then(effects => resolve(effects.records))
      .catch(err => reject(err))
  );

const trust = (currencyCode, maxTrust, issuer, stellarKeys) =>
  new Promise((resolve, reject) => {
    getServer()
      .accounts()
      .accountId(stellarKeys.accountId)
      .call()
      .then(account => {
        const userAccount = new StellarSdk.Account(stellarKeys.accountId, account.sequence);
        const transaction = new StellarSdk.TransactionBuilder(userAccount)
          .addOperation(
            StellarSdk.Operation.changeTrust({
              asset: new StellarSdk.Asset(currencyCode, issuer),
              limit: maxTrust
            })
          )
          .build();
        transaction.sign(StellarSdk.Keypair.fromSeed(stellarKeys.secret));

        return getServer()
          .submitTransaction(transaction)
          .then(transactionResult => resolve(transactionResult))
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });

const pay = ({ destination, currency, currencyIssuer, amount, stellarKeys }) =>
  new Promise((resolve, reject) => {
    getServer()
      .accounts()
      .accountId(stellarKeys.adresse)
      .call()
      .then(account => {
        const userAccount = new StellarSdk.Account(stellarKeys.adresse, account.sequence);

        const transaction = new StellarSdk.TransactionBuilder(userAccount)
          .addOperation(
            StellarSdk.Operation.payment({
              destination,
              asset: new StellarSdk.Asset(currency, currencyIssuer),
              amount: amount.toString()
            })
          )
          .build();
        transaction.sign(StellarSdk.Keypair.fromSeed(stellarKeys.secret));
        return getServer()
          .submitTransaction(transaction)
          .then(transactionResult => resolve(transactionResult))
          .catch(err => reject(err));
      })
      .catch(err => reject(err));
  });

const fedLookup = name =>
  new Promise((resolve, reject) => {
    const hostname = name.split("*")[1];
    return request.get(`https://${hostname}/.well-known/stellar.toml`).end((err, resp) => {
      if (err) {
        reject(err);
      }
      const configJSON = toml.parse(resp.text);
      const fedServer = configJSON.FEDERATION_SERVER;
      return request.get(`${fedServer}?q=${name}&type=name`).type("text/plain").end((error, response) => {
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
  getServer,
  loadEffects
};
