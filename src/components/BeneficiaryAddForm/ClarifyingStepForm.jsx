import { Button, Form, message } from 'antd';
import React from 'react';
import { getBeneficiaryFields } from '../../api';
import CountrySelect from '../CountrySelect';
import CurrencySelect from '../CurrencySelect';

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

export default ClarifyingStepForm;

// const TypeSelect = ({ form }) => {
//   const options = [
//     { value: 'company', title: 'Company' },
//     { value: 'individual', title: 'Individual' }
//   ];
//   return (
//     <SelectItem
//       form={form}
//       label="Type"
//       id="entityType"
//       options={options}
//       required
//     />
//   );
// };

const BankAccountCountrySelect = ({ form }) => (
  <CountrySelect
    form={form}
    label="Bank Account Country"
    id="bankAccountCountry"
  />
);
