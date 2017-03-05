import React, { PropTypes, Component } from 'react';
import round from 'lodash/round';
import RaisedButton from 'material-ui/RaisedButton';
import AddShoppingCart from 'material-ui/svg-icons/action/add-shopping-cart';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableRowColumn,
  TableHeaderColumn,
} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import KeyboardDownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import KeyboardUpIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-up';

import { prixAuKg, detailPrix } from 'containers/CommandeEdit/components/components/AffichePrix';
import styles from './styles.css';

const generateTarifMin = (tarifications, idx) => {
  if (idx === 0)
    return <span><strong>1</strong> à <strong>{tarifications[1].qteMinRelais - 1}</strong></span>;
  const tarif = tarifications[idx];
  return tarifications[idx + 1]
    ? <span>
        <strong>{tarif.qteMinRelais}</strong> à <strong>{tarifications[idx + 1].qteMinRelais - 1}</strong>
      </span>
    : <span><strong>{tarif.qteMinRelais} et plus</strong></span>;
};

class OffreDetails extends Component {
  static propTypes = {
    qteCommande: PropTypes.number.isRequired,
    offre: PropTypes.object.isRequired,
    typeProduit: PropTypes.object.isRequired,
    subTitle: PropTypes.string,
    onClick: PropTypes.func,
    expandable: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    qteCommande: 0,
    expandable: false,
  };

  state = {
    expanded: false,
  };

  toggleState = () => this.setState({ expanded: !this.state.expanded });

  render() {
    const {
      subTitle,
      onClick,
      offre,
      typeProduit,
      qteCommande,
      expandable,
    } = this.props;
    const { expanded } = this.state;
    const dPrix = detailPrix(offre, qteCommande, 'json');
    const pAuKg = prixAuKg(offre, typeProduit, 'json');

    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.text} onClick={expandable ? this.toggleState : null}>
            <div className={styles.title}>
              <span>
                <strong style={{ color: '#1565C0' }}>
                  {parseFloat(dPrix.prix).toFixed(2)} €
                  - <small>{dPrix.descriptionPdt}</small>
                </strong>
                {offre.poids && <small style={{ color: 'gray' }}>{`${'   '}${pAuKg.prixAuKg} € / Kg`}</small>}
              </span>
            </div>
            {subTitle && expandable && <div className={styles.subTitle}>{subTitle}</div>}
          </div>
          <div className={styles.action}>
            {onClick && <RaisedButton primary onClick={onClick} icon={<AddShoppingCart />} />}
          </div>
          {expandable &&
            <div className={styles.expand}>
              <IconButton onClick={this.toggleState} style={{ width: '100%', textAlign: 'right' }}>
                {!expanded && <KeyboardDownIcon />}
                {expanded && <KeyboardUpIcon />}
              </IconButton>
            </div>}
        </div>
        {expanded &&
          <div style={{ padding: '1em' }}>
            <Table selectable={false} multiSelectable={false}>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false} style={{ color: 'black' }}>
                <TableRow>
                  <TableHeaderColumn style={{ textAlign: 'left', color: 'black' }}>
                    Quantité achetée <sup>*</sup>
                  </TableHeaderColumn>
                  <TableHeaderColumn style={{ textAlign: 'right', color: 'black' }}>
                    Tarif
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {offre.tarifications.map((t, index, tarifications) => (
                  <TableRow>
                    <TableRowColumn>
                      {generateTarifMin(tarifications, index)}
                    </TableRowColumn>
                    <TableRowColumn style={{ textAlign: 'right' }}>
                      {parseFloat(round((t.prix + t.recolteFond) / 100, 2)).toFixed(2)} €
                    </TableRowColumn>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p style={{ textAlign: 'center' }}>
              <sup>*</sup> Quantité globale achetée par tous les participants de la commande
            </p>
          </div>}
      </div>
    );
  }
}

export default OffreDetails;
