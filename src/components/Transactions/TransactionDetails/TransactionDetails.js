import React, { useState, useEffect } from 'react';
import resolvePath from 'object-resolve-path';
import { startCase } from 'lodash';
import { Descriptions, Icon, Modal } from 'antd';
import styles from './ModalStyles.modules.css';
import { formatISODate } from '../../../util';
import { TransactionAmount } from '../TransactionCard';
import { LINKED_ACC_TYPES } from '..';

const TransactionDetails = ({
  modalShown,
  modalData: transaction,
  toggleModal,
}) => {
  if (!transaction) {
    return null;
  }

  const transactionDirection = transaction.type;
  const linkedAccType = LINKED_ACC_TYPES[transactionDirection];

  const [counterparty, setCounterparty] = useState({
    name: '',
    account_number: '',
  });

  const [details, setDetails] = useState();
  useEffect(() => {
    if (transaction.details) {
      setCounterparty(transaction.details[linkedAccType]);
      setDetails(transaction.details);
      if (transaction.details.type?.toLowerCase() === 'purchase') {
        setCounterparty(transaction.details.purchase.merchant);
      }
    }
  }, [transaction]);

  return (
    <Modal
      visible={modalShown}
      footer={null}
      onCancel={() => toggleModal(false)}
      width={720}
    >
      <Descriptions
        title="Transaction Details"
        size="small"
        bordered
        column={2}
        className={styles.descriptions}
      >
        <Descriptions.Item
          label="Amount"
          span={2}
          className={styles.itemContent}
        >
          <TransactionAmount
            transactionDirection={transactionDirection}
            amount={transaction.amount}
            currency={transaction.currency}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Type" className={styles.itemContent} span={2}>
          {details && details.type}
        </Descriptions.Item>
        <Descriptions.Item
          label={startCase(linkedAccType)}
          className={styles.itemContent}
          span={2}
        >
          {counterparty.name}
        </Descriptions.Item>
        <Descriptions.Item
          label="Account number"
          span={2}
          className={styles.itemContent}
        >
          {counterparty.account_number}
        </Descriptions.Item>
        <Descriptions.Item
          label="Notes"
          span={2}
          className={styles.itemContent}
        >
          {transaction.notes}
        </Descriptions.Item>
        <Descriptions.Item
          label="Booking"
          span={2}
          className={styles.itemContent}
        >
          {formatISODate(transaction.bookingDate)}
        </Descriptions.Item>
        <Descriptions.Item
          label="Creation"
          span={2}
          className={styles.itemContent}
        >
          {formatISODate(transaction.creationDate)}
        </Descriptions.Item>
        <Descriptions.Item
          label="Value"
          span={2}
          className={styles.itemContent}
        >
          {formatISODate(transaction.valueDate)}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default TransactionDetails;
