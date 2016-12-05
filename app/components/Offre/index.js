import React, { PropTypes } from 'react';
import { Card, CardActions, CardHeader } from 'material-ui/Card';
import ShoppingCartIcon from 'material-ui/svg-icons/action/shopping-cart';
import GradeIcon from 'material-ui/svg-icons/action/grade';
import FlatButton from 'material-ui/FlatButton';
import LinearProgress from 'material-ui/LinearProgress';
import { orange800, green500, cyan500 } from 'material-ui/styles/colors';

const offre = ({ imageSrc, nom, tarif, prct, fav }) => (
  <Card style={{ marginBottom: 20 }}>
    <CardHeader
      title={nom}
      subtitle={tarif}
      avatar={imageSrc}
      actAsExpander
      showExpandableButton
    />
    <div style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 10 }}>
      <LinearProgress
        mode="determinate"
        value={prct}
        color={prct < 100 ? cyan500 : green500}
        style={{ height: 6, backgroundColor: '#EDE7E7' }}
      />
    </div>
    <CardActions expandable>
      <div className="row">
        <div className="col-md-10">
          <FlatButton
            label="Commander"
            labelPosition="before"
            icon={<ShoppingCartIcon color="black" />}
          />
        </div>
        <div className="col-md-2 text-right" style={{ paddingRight: 0 }}>
          <FlatButton
            href="https://github.com/callemall/material-ui"
            style={{ minWidth: 5 }}
            icon={<GradeIcon style={{ color: fav ? orange800 : 'silver' }} />}
          />
        </div>
      </div>
    </CardActions>
  </Card>
);

offre.propTypes = {
  imageSrc: PropTypes.string.isRequired,
  nom: PropTypes.string.isRequired,
  prct: PropTypes.number.isRequired,
  fav: PropTypes.bool.isRequired,
  tarif: PropTypes.string.isRequired,
};

export default offre;
