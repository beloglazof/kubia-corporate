import { Button, Form, Result, Steps, PageHeader } from 'antd';
import React, { useState } from 'react';
import { useStepsForm } from 'sunflower-antd';
import { createBeneficiary } from '../../api';
import BeneficiaryInfoStepForm from './BeneficiaryInfoStepForm';
import ClarifyingStepForm from './ClarifyingStepForm';
import TopTitle from '../TopTitle';

const { Step } = Steps;

const BeneficiaryAddForm = ({ history, form }) => {
  const [clarifiedInfo, setClarifiedInfo] = useState();

  const handleSubmit = async inputedFields => {
    form.validateFields(async errors => {
      if (errors) return;
      const mapFieldValues = fieldsObj => {
        const fields = Object.entries(fieldsObj).reduce(
          (acc, [fieldName, fieldPattern]) => {
            if (typeof fieldPattern === 'object') {
              const newAcc = {
                ...acc,
                [fieldName]: mapFieldValues(fieldPattern),
              };
              return newAcc;
            } else {
              return { ...acc, [fieldName]: inputedFields[fieldName] };
            }
          },
          {}
        );
        return fields;
      };
      const { nickname, email } = inputedFields;
      const { bankAccountCountry, currency } = clarifiedInfo;
      const structuredFields = mapFieldValues(mainFormFields);
      const params = {
        ...structuredFields,
        bankAccount: {
          ...structuredFields.bankAccount,
          country: bankAccountCountry,
          currency,
        },
        entityType: 'company',
        nickname,
        email,
      };
      // console.log(params);
      const id = await createBeneficiary(params);
      if (id) {
        gotoStep(current + 1);
      }
    });
  };

  const { current, gotoStep, stepsProps, formProps, submit } = useStepsForm({
    submit: handleSubmit,
    form,
    total: 3,
  });

  const [mainFormFields, setMainFormFields] = useState();

  const goToBeneficiaries = () => {
    history.push('/beneficiaries');
  };

  const formLayoutProps = {
    // labelCol: {
    //   xs: { span: 6 },
    //   sm: { span: 6 },
    // },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 12 },
    },
    labelAlign: 'left',
    layout: 'vertical'
  };

  // const submitButtonLayoutProps = {
  //   wrapperCol: {
  //     xs: { offset: formLayoutProps.labelCol.xs.span },
  //     sm: { offset: formLayoutProps.labelCol.sm.span },
  //   },
  // };
  return (
    <>
      <TopTitle title="Add new beneficiary" backButton />

      {/* <Steps {...stepsProps}>
        <Step />
        <Step />
        <Step />
      </Steps> */}

      <Form
        {...formLayoutProps}
        {...formProps}
        style={{ margin: '2em 0' }}
        hideRequiredMark
      >
        {current === 0 && (
          <ClarifyingStepForm
            form={form}
            setMainFormFields={setMainFormFields}
            setClarifiedInfo={setClarifiedInfo}
            gotoStep={gotoStep}
            current={current}
            // submitButtonLayoutProps={submitButtonLayoutProps}
          />
        )}
        {current === 1 && (
          <BeneficiaryInfoStepForm
            form={form}
            fields={mainFormFields}
            submit={submit}
            // submitButtonLayoutProps={submitButtonLayoutProps}
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
