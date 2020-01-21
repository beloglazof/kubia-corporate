// @ts-check
import React, { useState, useEffect } from 'react';
import { startCase } from 'lodash';
import { Tooltip, Icon, Card } from 'antd';
import { LINKED_ACC_TYPES, COLORS } from '.';
import { formatISODate } from '../../util';

//  Currency with tooltip
const currencyTooltip = currency => {
  return (
    <Tooltip title={currency?.name}>
      <span>{currency?.symbol}</span>
    </Tooltip>
  );
};

//  Amount styled with tooltip
const amountTooltip = amount => {
  const normalizedAmount = String(amount).replace('-', '');
  const formattedAmount = Number(normalizedAmount).toFixed(2);
  return (
    <Tooltip title="Amount">
      <span>{formattedAmount}</span>
    </Tooltip>
  );
};

const TransactionCard = ({ transaction, handleClick }) => {
  const transactionDirection = transaction.type;
  const linkedAccType = LINKED_ACC_TYPES[transaction.type];
  const [counterparty, setCounterparty] = useState({
    name: '',
  });

  useEffect(() => {
    if (transaction.details) {
      setCounterparty(transaction.details[linkedAccType]);
      if (transaction.details.type?.toLowerCase() === 'purchase') {
        setCounterparty(transaction.details.purchase.merchant);
      }
    }
  }, [transaction]);
  const color = COLORS[transactionDirection];
  return (
    <Card
      size="small"
      hoverable
      style={{ margin: 'auto auto 10px', width: '50%' }}
      headStyle={{ textAlign: 'left' }}
      bodyStyle={{
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
      }}
      onClick={() => handleClick(transaction)}
    >
      <Icon
        type="transaction"
        style={{ fontSize: '2em', marginRight: '1em' }}
      />
      <div style={{ textAlign: 'left', flexGrow: 1 }}>
        <Tooltip title={startCase(linkedAccType)}>
          <b>{counterparty.name}</b>
        </Tooltip>
        <br />
        {formatISODate(transaction.creationDate, 'dd MMMM yyyy')}
      </div>
      <span
        style={{
          fontSize: '1.1em',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          backgroundColor: color,
          borderRadius: '8px',
          padding: '5px'
        }}
      >
        {transactionDirection === 'WITHDRAWAL' ? '-' : ''}
        {currencyTooltip(transaction.currency)}
        {amountTooltip(transaction.amount)}
      </span>
    </Card>
  );
};

export default TransactionCard;
