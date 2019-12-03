import React, { useState } from 'react';
import { useStepsForm } from 'sunflower-antd';
import { Button, Form, Result, Steps } from 'antd';
import { getCountries, getCurrencies, createBeneficiary } from '../../api';
import ClarifyingStepForm from './ClarifyingStepForm';
import BeneficiaryInfoStepForm from './BeneficiaryInfoStepForm';
import useAsync from '../../hooks/useAsync';

const { Step } = Steps;

const BeneficiaryAddForm = ({ history, form }) => {
  const handleSubmit = async values => {
    form.validateFields(async errors => {
      if (errors) return;
      const params = {
        ...values,
        entityType: 'company'
      };
      const id = await createBeneficiary(params);
      if (id) {
        gotoStep(current + 1);
      }
    });
  };

  const { current, gotoStep, stepsProps, formProps, submit } = useStepsForm({
    submit: handleSubmit,
    form,
    total: 3
  });

  const [mainFormFields, setMainFormFields] = useState();

  const goToBeneficiaries = () => {
    history.push('/beneficiaries');
  };

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
  return (
    <>
      <h1 style={{ marginBottom: '2em' }}>Add new beneficiary</h1>

      <Steps {...stepsProps}>
        <Step />
        <Step />
        <Step />
      </Steps>

      <Form {...formLayout} {...formProps} style={{ margin: '2em 0' }}>
        {current === 0 && (
          <ClarifyingStepForm
            form={form}
            setMainFormFields={setMainFormFields}
            gotoStep={gotoStep}
            current={current}
          />
        )}
        {current === 1 && (
          <BeneficiaryInfoStepForm
            form={form}
            fields={mainFormFields}
            submit={submit}
          />
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
    </>
  );
};

export default Form.create()(BeneficiaryAddForm);
