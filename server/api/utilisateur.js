const Utilisateur = require(`${__dirname}/../models/utilisateur`);
const thinky = require(`${__dirname}/../models/util/thinky`);
const Errors = thinky.Errors;

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
      res.send({ username: 'test@free.fr', password: 'azerty' });
    } else {
      res.status(403).send({ statusText: 'Indentifiants incorrects' });
    }
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
