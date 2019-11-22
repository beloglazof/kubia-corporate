import React from 'react';
import resolvePath from 'object-resolve-path';

import { Descriptions, Icon, Modal } from 'antd';
import './ModalStyles.css';
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
    <Descriptions title="Transaction Details" size="small" bordered column={2}>
      <Descriptions.Item label="Amount" span={2}>
        {modalData.currency ? resolvePath(modalData.currency, 'symbol') : '$'}
        {modalData.amount}
      </Descriptions.Item>
      <Descriptions.Item label="Type">
        <Icon
          type={TRANS_ICONS[modalData.type]}
          style={{ color: COLORS[modalData.type] }}
        />
        {modalData.type}
      </Descriptions.Item>
      <Descriptions.Item label={LINKED_ACC_TYPES[modalData.type]}>
        {modalData.linked_account
          ? resolvePath(modalData.linked_account, 'name')
          : 'Not mentioned'}
      </Descriptions.Item>
      <Descriptions.Item label="Account number" span={2}>
        {modalData.account
          ? resolvePath(modalData.account, 'number')
          : 'No number'}
      </Descriptions.Item>
      <Descriptions.Item label="Notes" span={2}>
        {modalData.notes}
      </Descriptions.Item>
      <Descriptions.Item label="Booking" span={2}>
        {formatISODate(modalData.bookingDate)}
      </Descriptions.Item>
      <Descriptions.Item label="Creation" span={2}>
        {formatISODate(modalData.creationDate)}
      </Descriptions.Item>
      <Descriptions.Item label="Value" span={2}>
        {formatISODate(modalData.valueDate)}
      </Descriptions.Item>
    </Descriptions>
  </Modal>
);

export default TransactionDetails;
