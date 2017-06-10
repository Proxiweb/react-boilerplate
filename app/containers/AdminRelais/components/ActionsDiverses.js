import React from 'react';
import PropTypes from 'prop-types';
import EnvoiMessage from 'containers/AdminRelais/containers/EnvoiMessage';
import RaisedButton from 'material-ui/RaisedButton';

const ActionsDiverses = ({ utilisateurs, relaiId, setView }) =>
  <div className="row center-md">
    <div className="col-md-12">
      <EnvoiMessage utilisateurs={utilisateurs} relaiId={relaiId} />
    </div>
    <div className="col-md-6" style={{ marginTop: '1em' }}>
      <RaisedButton primary label="Ajouter un adhérent" onClick={() => setView('nouvel_adherent')} />
    </div>
  </div>;

ActionsDiverses.propTypes = {
  relaiId: PropTypes.string.isRequired,
  utilisateurs: PropTypes.array.isRequired,
  setView: PropTypes.func.isRequired,
};

export default ActionsDiverses;
