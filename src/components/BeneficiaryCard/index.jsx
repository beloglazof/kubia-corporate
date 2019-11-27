import { startCase } from 'lodash';
import { Button, Card, Descriptions, Modal } from 'antd';
import React from 'react';
import { useModal } from 'sunflower-antd';

const BeneficiaryCard = ({ beneficiary = {} }) => {
  const { modalProps, show, close } = useModal();
  const fieldsSet = new Set([
    'accountNumber',
    'companyName',
    'email',
    'firstName',
    'lastName',
    'country'
  ]);
  const details = Object.entries(beneficiary);
  const fields = details.filter(([name]) => fieldsSet.has(name));
  const cardTitle = startCase(beneficiary?.nickname) || null;

  const actions = getCardActions(show);
  return (
    <Card
      title={cardTitle}
      headStyle={{ fontSize: '1.5em' }}
      size={'small'}
      actions={actions}
    >
      <Descriptions bordered column={2} layout="vertical">
        {renderFields(fields)}
      </Descriptions>
      <DetailsModal {...modalProps} details={details} />
    </Card>
  );
};

export default BeneficiaryCard;

const getCardActions = showDetails => {
  const editBeneficiary = () => {};
  const beneficiaryDetails = () => {
    showDetails();
  };
  const deleteBeneficiary = () => {};
  const cardActions = [
    { name: 'edit', handler: editBeneficiary, icon: 'edit' },
    { name: 'details', handler: beneficiaryDetails, icon: 'profile' },
    { name: 'delete', handler: deleteBeneficiary, icon: 'delete' }
  ];
  return cardActions.map(renderAction);
};

const renderAction = ({ name, handler, icon }) => {
  return (
    <Button type="primary" icon={icon} onClick={handler}>
      {startCase(name)}
    </Button>
  );
};

const renderFields = fields => {
  return fields.map(([name, value]) => {
    const label = startCase(name);
    const span = name === 'email' ? 2 : 1;
    return (
      <Descriptions.Item span={span} label={label} key={name}>
        <span style={{ fontWeight: 'bold' }}>{value}</span>
      </Descriptions.Item>
    );
  });
};

const DetailsModal = ({ details, ...props }) => {
  console.log(details);
  return (
    <Modal footer={null} closable title="Beneficiary details" {...props}>
      <Descriptions bordered column={2} layout="vertical">
        {renderFields(details)}
      </Descriptions>
    </Modal>
  );
};
