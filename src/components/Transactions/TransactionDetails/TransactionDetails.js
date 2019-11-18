import React from 'react';
import resolvePath from 'object-resolve-path';

import { Descriptions, Icon, Modal } from 'antd';
import './ModalStyles.css'; //  Additional modal styles

const TransactionDetails = ({
  modalShown,
  modalData,
  toggleModal,
  convertDate,
  convertTime,
  COLORS,
  TRANS_ICONS,
  LINKED_ACC_TYPES,
}) => (
  <Modal
    visible={modalShown}
    footer={null}
    onCancel={() => toggleModal(false)}
    width={720}
  >
    <Descriptions title="Transaction Details" size="small" bordered column={3}>
      <Descriptions.Item label="Amount" span={1.5}>
        {modalData.currency ? resolvePath(modalData.currency, 'symbol') : '$'} {modalData.amount}
      </Descriptions.Item>
      <Descriptions.Item label="Type" span={1.5}>
        <Icon
          type={TRANS_ICONS[modalData.type]}
          style={{ color: COLORS[modalData.type] }}
        /> {modalData.type}
      </Descriptions.Item>
      <Descriptions.Item label={LINKED_ACC_TYPES[modalData.type]} span={1.5}>
        {modalData.linked_account ? resolvePath(modalData.linked_account, 'name') : 'Not mentioned'}
      </Descriptions.Item>
      <Descriptions.Item label="Account number" span={1.5}>
        {modalData.account ? resolvePath(modalData.account, 'number') : 'No number'}
      </Descriptions.Item>
      <Descriptions.Item label="Notes" span={3}>
        {modalData.notes}
      </Descriptions.Item>
      <Descriptions.Item label="Booking">
        {convertDate(modalData.bookingDate)} {convertTime(modalData.bookingDate)}
      </Descriptions.Item>
      <Descriptions.Item label="Creation">
        {convertDate(modalData.creationDate)} {convertTime(modalData.creationDate)}
      </Descriptions.Item>
      <Descriptions.Item label="Value">
        {convertDate(modalData.valueDate)} {convertTime(modalData.valueDate)}
      </Descriptions.Item>
    </Descriptions>
  </Modal>
);

export default TransactionDetails;
