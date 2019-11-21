import React, { useEffect, useState } from 'react';
import { useStepsForm } from 'sunflower-antd';
import { Button, Form, Result, Steps } from 'antd';
import {
  getBeneficiaryFields,
  getCountries,
  getCurrencies,
  postBeneficiary
} from '../../api';
import ClarifyingStepForm from './ClarifyingStepForm';
import BeneficiaryInfoStepForm from './BeneficiaryInfoStepForm';

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
  const fields = data?.find(item => item.entityType === values.entityType);
  return fields;
};

const BeneficiaryAddForm = ({ history, form }) => {
  const handleSubmit = async values => {
    const params = {
      ...values
    };
    const id = await postBeneficiary(params);
    if (id) {
      gotoStep(current + 1);
    }
  };

  const { current, gotoStep, stepsProps, formProps, submit } = useStepsForm({
    submit: handleSubmit,
    form,
    total: 3
  });

  const [mainFormFields, setMainFormFields] = useState();

  const handleNext = async () => {
    const values = form.getFieldsValue();
    const mainFormFields = await getMainFormFields(values);
    if (mainFormFields) {
      setMainFormFields(mainFormFields);
    }
    gotoStep(current + 1);
  };

  
  // TODO useAsync
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    const fetchCountries = async () => {
      const fetchedCountries = await getCountries();
      console.log(fetchedCountries);
      if (fetchedCountries) {
        setCountries(fetchedCountries);
      }
    };
    fetchCountries();
  }, []);
  
  // TODO useAsync
  const [currencies, setCurrencies] = useState([]);
  useEffect(() => {
    const fetchCurrencies = async () => {
      const fetchedCurrencies = await getCurrencies();
      console.log(fetchedCurrencies);
      if (fetchedCurrencies) {
        setCurrencies(fetchedCurrencies);
      }
    };
    fetchCurrencies();
  }, []);

  const { Step } = Steps;
  const formLayout = {
    labelCol: {
      xs: { span: 6 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 12 }
    },
    labelAlign: 'left'
  };
  const goToBeneficiaries = () => {
    history.push('/beneficiaries');
  };
  return (
    <>
      <h1 style={{ marginBottom: '2em' }}>Add new beneficiary</h1>
      <Steps {...stepsProps}>
        <Step title="First Step" />
        <Step title="Second Step" />
        <Step title="Success" />
      </Steps>
      <Form {...formLayout} {...formProps} style={{ margin: '2em 0' }}>
        {current === 0 && (
          <ClarifyingStepForm
            form={form}
            countries={countries}
            currencies={currencies}
          />
        )}
        {current === 1 && (
          <BeneficiaryInfoStepForm form={form} fields={mainFormFields} />
        )}
      </Form>
      {current === 2 && (
        <Result
          status="success"
          title="Beneficiary added!"
          extra={
            <>
              <Button type="primary" onClick={() => gotoStep(0)}>
                Add another beneficiary
              </Button>
              <Button onClick={goToBeneficiaries}>
                Go to beneficiary list
              </Button>
            </>
          }
        />
      )}
      {current === 0 && (
        <Button type="primary" onClick={handleNext}>
          Next
        </Button>
      )}
      {current === 1 && (
        <Button type="primary" htmlType="submit" onClick={() => submit()}>
          Submit
        </Button>
      )}
    </>
  );
};

export default Form.create()(BeneficiaryAddForm);
