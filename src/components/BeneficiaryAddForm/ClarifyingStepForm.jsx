import { Button, Form, message } from 'antd';
import React, { useState } from 'react';
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
  const fields = response.find(item => item.entityType === 'company');
  return fields;
};

const ClarifyingStepForm = ({
  form,
  setMainFormFields,
  setClarifiedInfo,
  gotoStep,
  current,
  submitButtonLayoutProps,
}) => {
  const [loading, setLoading] = useState(false);
  const handleNext = async () => {
    form.validateFields(async (errors, values) => {
      if (errors) return;
      setClarifiedInfo(values);
      setLoading(true);
      const mainFormFields = await getMainFormFields(values);
      setLoading(false);
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
      <CurrencySelect form={form} extended />
      <Form.Item>
        <Button type="primary" onClick={handleNext} loading={loading}>
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
  current: PropTypes.number.isRequired,
};

export default ClarifyingStepForm;
