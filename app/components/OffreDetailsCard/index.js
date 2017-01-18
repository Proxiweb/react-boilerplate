import React, { PropTypes } from 'react';
import round from 'lodash/round';

import { Card, CardHeader, CardText } from 'material-ui/Card';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableRowColumn,
  TableHeaderColumn,
} from 'material-ui/Table';

import {
  detailPrix,
  prixAuKg,
} from 'containers/CommandeEdit/components/components/AffichePrix';

const OffreDetailsCard = (props) => {
  const { offre, typeProduit, showSubtitle } = props;
  const dPrix = detailPrix(offre, 0, 'json');
  const pAuKg = prixAuKg(offre, typeProduit, 'json');
  const tR = offre.tarifications.length > 1;

  const generateTarifMin = (tarifications, idx) => {
    if (idx === 0) return <span><strong>1</strong>{tarifications[1] && <span> à <strong>{tarifications[1].qteMinRelais - 1}</strong></span>}</span>;

    const tarif = tarifications[idx];
    return tarifications[idx + 1]
      ? <span><strong>{tarif.qteMinRelais}</strong> à <strong>{tarifications[idx + 1].qteMinRelais - 1}</strong></span>
      : <span><strong>{tarif.qteMinRelais} et plus</strong></span>;
  };
  return (
    <Card
      style={{
        backgroundColor: 'silver',
        border: 'solid 1px gray',
        boxShadow: 'none',
      }}
    >
      <CardHeader
        actAsExpander={tR}
        showExpandableButton={tR}
        textStyle={{ textAlign: 'left', paddingRight: 215 }}
        title={<span>
          {dPrix.descriptionPdt} : <strong>{parseFloat(dPrix.prix).toFixed(2)} €</strong>
          {offre.poids && <small style={{ color: 'gray' }}>{`${'   '}${pAuKg.prixAuKg} € / Kg`}</small>}
        </span>}
        subtitle={tR && showSubtitle && 'Tarif dégressif (En savoir plus...)'}
      />
      <CardText expandable>
        <Table
          selectable={false}
          multiSelectable={false}
        >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            style={{ color: 'black' }}
          >
            <TableRow>
              <TableHeaderColumn
                style={{ textAlign: 'left', color: 'black' }}
              >
                Quantité achetée
              </TableHeaderColumn>
              <TableHeaderColumn
                style={{ textAlign: 'right', color: 'black' }}
              >
                Tarif
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {offre.tarifications.map((t, index, tarifications) =>
              <TableRow key={index}>
                <TableRowColumn>
                  {generateTarifMin(tarifications, index)}
                </TableRowColumn>
                <TableRowColumn
                  style={{ textAlign: 'right' }}
                >
                  {parseFloat(round((t.prix + t.recolteFond) / 100, 2)).toFixed(2)} €
                </TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardText>
    </Card>
  );
};

OffreDetailsCard.propTypes = {
  offre: PropTypes.object.isRequired,
  typeProduit: PropTypes.object.isRequired,
  showSubtitle: PropTypes.bool.isRequired,
};

OffreDetailsCard.defaultProps = {
  showSubtitle: 'true',
};

export default OffreDetailsCard;
