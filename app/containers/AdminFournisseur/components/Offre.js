import React, { PropTypes, Component } from 'react';
import round from 'lodash/round';

import { Card, CardHeader, CardText } from 'material-ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableRowColumn, TableHeaderColumn } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import TrashIcon from 'material-ui/svg-icons/action/delete-forever';

import { detailPrix, prixAuKg } from 'containers/CommandeEdit/components/components/AffichePrix';
import styles from './styles.css';

export default class Offre extends Component { // eslint-disable-line
  static propTypes = {
    offre: PropTypes.object.isRequired,
    typeProduit: PropTypes.object.isRequired,
    handleToggeState: PropTypes.func.isRequired,
  }

  render() {
    const { offre, typeProduit, handleToggeState } = this.props;
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
      <div className="row">
        <div className="col-md-10">
          {
            <div className={`row ${styles.offre}`}>
              <div className="col-md-12">
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
                    subtitle={tR && 'Tarif dégressif (cliquez pour plus de détails)'}
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
                          <TableRow>
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
              </div>
            </div>
          }
        </div>
        <div className="col-md-2">
          <IconButton
            onClick={handleToggeState}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={handleToggeState}
          >
            <TrashIcon />
          </IconButton>
        </div>
      </div>
    );
  }
}
