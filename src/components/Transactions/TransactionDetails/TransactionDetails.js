import React from 'react';
import resolvePath from 'object-resolve-path';

import { Descriptions, Icon, Modal } from 'antd';
import styles from './ModalStyles.modules.css';
import { formatISODate } from '../../../util';

const TransactionDetails = ({
  modalShown,
  modalData,
  toggleModal,
  COLORS,
  TRANS_ICONS,
  LINKED_ACC_TYPES
}) => (
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
      <Descriptions.Item label="Amount" span={2} className={styles.itemContent}>
        {modalData.currency ? resolvePath(modalData.currency, 'symbol') : '$'}
        {modalData.amount}
      </Descriptions.Item>
      <Descriptions.Item label="Type" className={styles.itemContent}>
        <Icon
          type={TRANS_ICONS[modalData.type]}
          style={{ color: COLORS[modalData.type] }}
        />
        {modalData.type}
      </Descriptions.Item>
      <Descriptions.Item
        label={LINKED_ACC_TYPES[modalData.type]}
        className={styles.itemContent}
      >
        {modalData.linked_account
          ? resolvePath(modalData.linked_account, 'name')
          : 'Not mentioned'}
      </Descriptions.Item>
      <Descriptions.Item
        label="Account number"
        span={2}
        className={styles.itemContent}
      >
        {modalData.account
          ? resolvePath(modalData.account, 'number')
          : 'No number'}
      </Descriptions.Item>
      <Descriptions.Item label="Notes" span={2} className={styles.itemContent}>
        {modalData.notes}
      </Descriptions.Item>
      <Descriptions.Item
        label="Booking"
        span={2}
        className={styles.itemContent}
      >
        {formatISODate(modalData.bookingDate)}
      </Descriptions.Item>
      <Descriptions.Item
        label="Creation"
        span={2}
        className={styles.itemContent}
      >
        {formatISODate(modalData.creationDate)}
      </Descriptions.Item>
      <Descriptions.Item label="Value" span={2} className={styles.itemContent}>
        {formatISODate(modalData.valueDate)}
      </Descriptions.Item>
    </Descriptions>
  </Modal>
);

export default TransactionDetails;
