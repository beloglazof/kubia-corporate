import React, { useState, useEffect } from 'react';
import resolvePath from 'object-resolve-path';
import {startCase} from 'lodash'
import { Descriptions, Icon, Modal } from 'antd';
import styles from './ModalStyles.modules.css';
import { formatISODate } from '../../../util';

const TransactionDetails = ({
  modalShown,
  modalData: transaction,
  toggleModal,
  COLORS,
  TRANS_ICONS,
  LINKED_ACC_TYPES,
}) => {
  if (!transaction) return null;

  const transactionType = transaction.type;
  const color = COLORS[transactionType];
  const icon = TRANS_ICONS[transactionType];
  const linkedAccType = LINKED_ACC_TYPES[transaction.type];

  const [linkedAccount, setLinkedAccount] = useState({
    name: '',
    account_number: '',
  });
  useEffect(() => {
    if (transaction.details) {
      setLinkedAccount(transaction.details[linkedAccType]);
    }
  }, [transaction.details]);
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
          {transaction.currency
            ? resolvePath(transaction.currency, 'symbol')
            : '$'}
          {transaction.amount}
        </Descriptions.Item>
        <Descriptions.Item label="Type" className={styles.itemContent}>
          <Icon
            type={TRANS_ICONS[transaction.type]}
            style={{ color: COLORS[transaction.type] }}
          />
          {transaction.type}
        </Descriptions.Item>
        <Descriptions.Item
          label={startCase(linkedAccType)}
          className={styles.itemContent}
        >
          {linkedAccount.name}
        </Descriptions.Item>
        <Descriptions.Item
          label="Account number"
          span={2}
          className={styles.itemContent}
        >
          {linkedAccount.account_number}
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
