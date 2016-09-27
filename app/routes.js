// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from 'utils/asyncInjectors';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars

  return [
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/HomePage/reducer'),
          System.import('containers/HomePage'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, component]) => {
          injectReducer('datas', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/votre-compte',
      getComponent(location, cb) {
        System.import('containers/CompteUtilisateur')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/login',
      getComponent(location, cb) {
        const importModules = Promise.all([
          System.import('containers/Login/index'),
          System.import('containers/Login/sagas'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component, sagas]) => {
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/commandes',
      name: 'commandes',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/Commande/reducer'),
          System.import('containers/Commande/sagas'),
          System.import('containers/Commande'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('commandes', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });
        importModules.catch(errorLoading);
      },
    }, {
      path: '/commandes/:commandeId',
      name: 'commande',
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          System.import('containers/CommandeEdit/reducer'),
          System.import('containers/CommandeEdit/sagas'),
          System.import('containers/CommandeEdit/index'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('commande', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
      childRoutes: [{
        path: 'typeProduits/:typeProduitId',
        name: 'typeProduits',
        getComponent(nextState, cb) {
          System.import('containers/CommandeEdit')
            .then(loadModule(cb))
            .catch(errorLoading);
        },
        childRoutes: [{
          path: 'produits/:produitId',
          name: 'produits',
          getComponent(nextState, cb) {
            System.import('containers/CommandeEdit')
              .then(loadModule(cb))
              .catch(errorLoading);
          },
        }],
      }],
    }, {
      path: '/stellar',
      getComponent(location, cb) {
        const importModules = Promise.all([
          System.import('containers/Stellar/reducer'),
          System.import('containers/Stellar/sagas'),
          System.import('containers/Stellar/index'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reducer, sagas, component]) => {
          injectReducer('stellar', reducer.default);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        System.import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
