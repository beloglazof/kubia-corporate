import { startCase } from 'lodash';
import { Button, Card, Descriptions, Form, Modal, Popconfirm } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { useForm, useModal } from 'sunflower-antd';
import InputItem from '../InputItem';
import CountrySelect from '../CountrySelect';

const getCardActions = (showDetails, onDelete, showEditModal) => {
  const editBeneficiary = () => {
    showEditModal();
  };
  const beneficiaryDetails = () => {
    showDetails();
  };
  const handleDelete = async () => await onDelete();

  const cardActions = [
    { name: 'edit', handler: editBeneficiary, icon: 'edit' },
    { name: 'details', handler: beneficiaryDetails, icon: 'profile' },
    { name: 'delete', handler: handleDelete, icon: 'delete' }
  ];
  return cardActions.map(renderAction);
};

const renderAction = ({ name, handler, icon }) => {
  const styles = {
    marginBottom: 0
  };
  if (name === 'delete') {
    return (
      <Popconfirm
        title="Are you sure delete beneficiary?"
        onConfirm={handler}
        okText="Yes"
        cancelText="No"
      >
        <Button style={styles} type="danger" icon={icon}>
          {startCase(name)}
        </Button>
      </Popconfirm>
    );
  }
  return (
    <Button type="primary" icon={icon} onClick={handler} style={styles}>
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
  return (
    <Modal
      footer={null}
      destroyOnClose
      closable
      title="Beneficiary details"
      {...props}
    >
      <Descriptions bordered column={2} layout="vertical">
        {renderFields(details)}
      </Descriptions>
    </Modal>
  );
};

const renderFormFields = (form, fields) => {
  const renderField = ([fieldName, value]) => {
    const disabledFields = new Set(['entityType']);
    const disabled = disabledFields.has(fieldName);

    const isCountryField = fieldName === 'country';

    const startCasedName = startCase(fieldName);
    const label = fieldName === 'bicSwift' ? 'SWIFT' : startCasedName;
    const placeholder = label;

    if (isCountryField) {
      return (
        <CountrySelect
          form={form}
          initialValue={value.toLowerCase()}
          key={fieldName}
        />
      );
    }

    return (
      <InputItem
        form={form}
        id={fieldName}
        placeholder={placeholder}
        label={label}
        key={fieldName}
        disabled={disabled}
        initialValue={value}
        required
      />
    );
  };
  return fields.map(renderField);
};

const EditBeneficiaryFormModal = ({
  form,
  details,
  onEdit,
  close,
  ...props
}) => {
  const handleSubmit = event => {
    form.validateFields((errors, values) => {
      // console.log(values);
      if (!errors) {
        onEdit(values);
        close();
      }
    });
  };
  const { formProps } = useForm({ form, submit: handleSubmit });
  const formLayout = {
    labelCol: {
      span: 9
    },
    wrapperCol: {
      span: 14
    },
    labelAlign: 'right'
  };
  return (
    <Modal
      {...props}
      onOk={handleSubmit}
      okText="Save"
      title="Edit beneficiary"
      closable
      destroyOnClose
    >
      <Form {...formProps} {...formLayout}>
        {renderFormFields(form, details)}
      </Form>
    </Modal>
  );
};

const EditFormModal = Form.create()(EditBeneficiaryFormModal);

const BeneficiaryCard = ({ beneficiary = {}, onDelete, onEdit }) => {
  const { modalProps: detailsModalProps, show: showDetails } = useModal({
    defaultVisible: false
  });
  const {
    modalProps: editModalProps,
    show: showEditModal,
    close: closeEditModal
  } = useModal({
    defaultVisible: false
  });

  const fieldsSet = new Set([
    'accountNumber',
    'companyName',
    'email',
    'firstName',
    'lastName',
    'country'
  ]);
  const details = Object.entries(beneficiary).filter(
    ([fieldName]) => fieldName !== 'id'
  );
  const fields = details.filter(([name]) => fieldsSet.has(name));
  const cardTitle = startCase(beneficiary?.nickname) || null;

  const actions = getCardActions(showDetails, onDelete, showEditModal);
  return (
    <Card
      title={cardTitle}
      headStyle={{
        fontSize: '1.6em',
        marginLeft: '1em',
        lineHeight: '1.5em'
      }}
      actions={actions}
      size="small"
    >
      <Descriptions bordered column={2} layout="vertical">
        {renderFields(fields)}
      </Descriptions>
      <DetailsModal {...detailsModalProps} details={details} />
      <EditFormModal
        {...editModalProps}
        close={closeEditModal}
        details={details}
        onEdit={onEdit}
      />
    </Card>
  );
};

BeneficiaryCard.propTypes = {
  beneficiary: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default BeneficiaryCard;
