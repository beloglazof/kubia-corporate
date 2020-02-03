// @ts-check
import React, { useState, useEffect } from 'react';
import { startCase } from 'lodash';
import { Tooltip, Icon, Card } from 'antd';
import { LINKED_ACC_TYPES, COLORS } from '.';
import { formatISODate, formatAmount } from '../../util';

//  Currency with tooltip
const currencyTooltip = currency => {
  return (
    <Tooltip title={currency?.name}>
      <span>{currency?.symbol}</span>
    </Tooltip>
  );
};

//  Amount styled with tooltip
const amountTooltip = amount => (
  <Tooltip title="Amount">
    <span>{amount}</span>
  </Tooltip>
);

export const TransactionAmount = ({ transactionDirection, currency, amount }) => {
  const color = COLORS[transactionDirection];
  const directionSign = transactionDirection === 'WITHDRAWAL' ? '-' : '';
  const formattedAmount = formatAmount(amount);

  return (
    <span
      style={{
        fontSize: '1.1em',
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        backgroundColor: color,
        borderRadius: '8px',
        padding: '5px',
      }}
    >
      {directionSign}
      {currencyTooltip(currency)}
      {amountTooltip(formattedAmount)}
    </span>
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
      <TransactionAmount
        transactionDirection={transactionDirection}
        amount={transaction.amount}
        currency={transaction.currency}
      />
    </Card>
  );
};

export default TransactionCard;
