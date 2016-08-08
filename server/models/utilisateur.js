const thinky = require('./util/thinky.js');
const type = thinky.type;
const r = thinky.r;

const Utilisateur = thinky.createModel('utilisateur', {
  id: type.string(),
  email: type.string().allowNull(false),
  password: type.string().allowNull(false),
  createdAt: type.date().allowNull(false),
}, { enforce_extra: 'remove' });

Utilisateur.ensureIndex('email');

Utilisateur.pre('save', function(next) { // eslint-disable-line
  if (!this.createdAt) {
    this.createdAt = r.now().inTimezone('+02:00');
  }
  next();
});

Utilisateur.defineStatic('uniqueResult', function define() {
  return this.nth(0).default(null);
});

module.exports = Utilisateur;
