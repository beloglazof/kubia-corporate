import { Button, Form, message } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import { getBeneficiaryFields } from '../../api';
import CountrySelect from '../CountrySelect';
import CurrencySelect from '../CurrencySelect';

const BankAccountCountrySelect = ({ form }) => (
  <CountrySelect
    form={form}
    label="Bank Account Country"
    id="bankAccountCountry"
  />
);

const getMainFormFields = async values => {
  const { country, bankAccountCountry, currency } = values;
  const response = await getBeneficiaryFields(
    currency,
    bankAccountCountry,
    country
  );
  if (!response) {
    return;
  }
  const data = response[0]?.data;
  const fields = data?.find(item => item.entityType === 'company');
  return fields;
};

const ClarifyingStepForm = ({ form, setMainFormFields, gotoStep, current }) => {
  const handleNext = async () => {
    form.validateFields(async (errors, values) => {
      if (errors) return;
      const mainFormFields = await getMainFormFields(values);
      if (mainFormFields) {
        setMainFormFields(mainFormFields);
        gotoStep(current + 1);
      } else {
        message.error('We do not support selected configuration.', 5);
      }
    });
  };

  return (
    <>
      <CountrySelect form={form} />
      <BankAccountCountrySelect form={form} />
      <CurrencySelect form={form} />
      <Form.Item wrapperCol={{ offset: 6 }}>
        <Button type="primary" onClick={handleNext}>
          Next
        </Button>
      </Form.Item>
    </>
  );
};

ClarifyingStepForm.propTypes = {
  form: PropTypes.object.isRequired,
  setMainFormFields: PropTypes.func.isRequired,
  gotoStep: PropTypes.func.isRequired,
  current: PropTypes.number.isRequired
};

export default ClarifyingStepForm;
