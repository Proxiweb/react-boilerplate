const Utilisateur = require(`${__dirname}/../models/utilisateur`);
const thinky = require(`${__dirname}/../models/util/thinky`);
const Errors = thinky.Errors;
const config = require('getconfig');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

function generateToken(user) {
  const u = {
    email: user.email,
    id: user.id,
    roles: user.roles,
  };
  const token = jwt.sign(u, config.jwtSecret, { expiresIn: 60 * 60 * 24 });
  return token;
}

const datas = {
  commandes: [
    {
      id: 1,
      date: '2016-06-01',
      terminee: true,
      commandeUtilisateurs: [
        {
          id: 1,
          utilisateur: {
            id: 1,
            pseudo: 'regisg',
          },
          contenus: [
            {
              id: 1,
              offreId: 6,
              offre: {
                id: 6,
                prix: 1,
                produitId: 1,
                produit: {
                  id: 1,
                  nom: 'courgette',
                },
              },
              quantite: 2,
            },
          ],
        },
        {
          id: 2,
          utilisateur: {
            id: 3,
            pseudo: 'sonia',
          },
          contenus: [
            {
              id: 2,
              offreId: 5,
              offre: {
                id: 5,
                prix: 4,
                produitId: 5,
                produit: {
                  id: 5,
                  nom: 'tomate',
                },
              },
              quantite: 5,
            },
          ],
        },
      ],
    },
    {
      id: 2,
      date: '2016-06-08',
      terminee: true,
      commandeUtilisateurs: [
        {
          id: 3,
          utilisateur: {
            id: 1,
            pseudo: 'regisg',
          },
          contenus: [
            {
              id: 3,
              offreId: 6,
              offre: {
                id: 6,
                prix: 1,
                produitId: 1,
                produit: {
                  id: 1,
                  nom: 'courgette',
                },
              },
              quantite: 1,
            },
          ],
        },
        {
          id: 4,
          utilisateur: {
            id: 2,
            pseudo: 'marcel',
          },
          contenus: [
            {
              id: 4,
              offreId: 7,
              offre: {
                id: 7,
                prix: 1.5,
                produitId: 8,
                produit: {
                  id: 8,
                  nom: 'pomme',
                },
              },
              quantite: 5,
            },
          ],
        },
      ],
    },
  ],
};

module.exports = (router) => {
  router.get('/login', (req, res) => {
    // Utilisateur
    //   .filter({
    //     email: req.query.username,
    //     password: req.body.password,
    //   })
    //   .uniqueResult()
    //   .run()
    //   .then(utilisateur => {
    //     res.send(utilisateur);
    //   })
    //   .catch(Errors.DocumentNotFound, () => {
    //     res.status(403).send({ statusText: 'Indentifiants incorrects' });
    //   });
    if (req.query.username === 'test@free.fr' && req.query.password === 'azerty') {
      const user = { username: 'test@free.fr', email: 'test@free.fr', id: 1, roles: ['USER', 'ADMIN'] };
      const token = generateToken(user);
      res.send({ user, token });
    } else {
      res.status(401).send({ error: 'Indentifiants incorrects' });
    }
  });

  router.get('/loadDatas1/:id', expressJwt({ secret: config.jwtSecret }), (req, res) => {
    res.send(req.user);
  });

  router.get('/loadDatas2/:id', expressJwt({ secret: config.jwtSecret }), (req, res, next) => {
    setTimeout(() => {
      if (req.user.roles.indexOf('SUPER_ADMIN') === -1) {
        res.status(403).send({ error: 'Droits insuffisants' });
        return next();
      }
      res.send(datas);
      return next();
    }, 5000);
  });

  router.get('/commandes/:page', expressJwt({ secret: config.jwtSecret }), (req, res, next) => {
    if (req.user.roles.indexOf('USER') === -1) {
      res.status(403).send({ error: 'Droits insuffisants' });
      return next();
    }
    res.send({ commandes: [datas.commandes[req.params.page]] });
    return next();
  });


  // https://lobstr.co/new/federation
  router.get('/federation', (req, res, next) => {
    if (req.query.q === 'polo@gmail.com*proxiweb.fr' && req.query.type === 'name') {
      res.send({
        stellar_address: 'polo@gmail.com*proxiweb.fr',
        account_id: 'GA3MATOBMSMSEQQKQWVOJRVJGPYCOEHD2DUMIONL75EZDSHCLHFYXTFY',
      });
    } else {
      res.status(404).send();
    }
    return next();
  });


  router.get('/utilisateurs', (req, res) => {
    setTimeout(() => res.status(200).send({ nom: 'pas cool' }), 1000);
  });

  router.get('/googleLogin', (req, res) => {
    Utilisateur
      .get(req.query.id)
      .run()
      .then(utilisateur => {
        res.send(utilisateur);
      })
      .catch(Errors.DocumentNotFound, () => {
        Utilisateur
          .filter({ email: req.query.email })
          .uniqueResult()
          .run()
          .then(() => {
            res.status(403).send({ statusText: 'Email déjà utilisé' });
          })
          .catch(Errors.DocumentNotFound, () => {
            // cet utilisateur ne s'est jamais connecté, créer un compte
            const utilisateur = new Utilisateur({ id: req.query.id, email: req.query.email });
            utilisateur
              .save()
              .then(util => {
                res.send(util);
              });
          });
      });
  });

  router.post('/checkMail', (req, res, next) => {
    Utilisateur
      .filter({ email: req.body.email })
      .run()
      .then(utilisateurs => {
        if (utilisateurs.length > 0) {
          res.status(400).send({ reponseText: 'Cette adresse email a déjà été utilisée' });
          return next();
        }
        res.send({ emai: 'Cette adresse email a déjà été utilisée' });
        return next();
      });
  });
};
