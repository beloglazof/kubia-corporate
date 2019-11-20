import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useForm, useStepsForm } from 'sunflower-antd';
import { Button, Form, Input, Result, Select, Steps } from 'antd';
import { startCase } from 'lodash';
import { getCountries, getCurrencies, postBeneficiary } from '../../api';

const InputItem = ({
  form,
  id = 'input',
  label = 'Input',
  placeholder = 'Placeholder',
  validationPattern,
  required = false,
  disabled
}) => {
  if (!form) return null;
  const rules = [];
  if (required) {
    const requiredRule = { required: true, message: `Please input ${label}` };
    rules.push(requiredRule);
  }
  if (validationPattern) {
    const patternRule = {
      pattern: new RegExp(validationPattern),
      message: `Invalid ${label} format`
    };
    rules.push(patternRule);
  }
  const fieldConfig = {
    rules,
    validateTrigger: 'onSubmit'
  };

  const fieldDecorator = form && form.getFieldDecorator(id, fieldConfig);
  return (
    <Form.Item label={label}>
      {fieldDecorator(<Input placeholder={placeholder} disabled={disabled} />)}
    </Form.Item>
  );
};

const SelectItem = ({ form, label, id, options, required }) => {
  // const form = useContext(FormContext);
  if (!form) return null;
  const rules = [];
  if (required) {
    const requiredRule = { required: true, message: `Please input ${label}` };
    rules.push(requiredRule);
  }
  const renderOption = ({ value, title }) => (
    <Select.Option value={value} key={value}>{title}</Select.Option>
  );
  const fieldConfig = {
    rules
  };
  return (
    <Form.Item label={label}>
      {form.getFieldDecorator(id, fieldConfig)(
        <Select>{options.map(renderOption)}</Select>
      )}
    </Form.Item>
  );
};

const TypeSelect = ({ form }) => {
  const options = [
    { value: 'company', title: 'Company' },
    { value: 'individual', title: 'Individual' }
  ];
  return (
    <SelectItem
      form={form}
      label="Type"
      id="entityType"
      options={options}
      required
    />
  );
};

const countries = [{ value: 'SG', title: 'Singapore' }];
const CountrySelect = ({ form, options }) => {
  return (
    <SelectItem
      form={form}
      label="Country"
      id="country"
      options={options}
      required
    />
  );
};

const BankAccountCountrySelect = ({ form, options }) => {
  return (
    <SelectItem
      form={form}
      label="Bank Account Country"
      id="bankAccountCountry"
      options={options}
      required
    />
  );
};

const CurrencySelect = ({ form, options }) => {
  const currencies = [{ value: 'usd', title: 'USD' }];
  return (
    <SelectItem
      form={form}
      label="Currency"
      id="currency"
      options={options}
      required
    />
  );
};

const getMainFormFields = values => {
  const data = [
    {
      entityType: 'company',
      address: '^.{1,255}',
      country: '^[A-z]{2}$',
      city: '^.{1,255}',
      companyName: '^.{1,255}',
      bankAccount: {
        bicSwift: '^[0-9A-Z]{8}$|^[0-9A-Z]{11}$',
        accountNumber: '^[0-9A-Z]{6,16}$',
        bankName: '^.{1,255}'
      }
    },
    {
      entityType: 'individual',
      address: '^.{1,255}',
      country: '^[A-z]{2}$',
      city: '^.{1,255}',
      firstName: '^.{1,255}',
      lastName: '^.{1,255}',
      bankAccount: {
        bicSwift: '^[0-9A-Z]{8}$|^[0-9A-Z]{11}$',
        accountNumber: '^[0-9A-Z]{6,16}$',
        bankName: '^.{1,255}'
      }
    }
  ];
  const fields = data.find(item => item.entityType === values.entityType);
  return fields;
};

const PreStepForm = ({ form, countries, currencies }) => {
  // console.log(countries);
  const fieldProps = { form };
  const countryOptions =
    countries && countries.map(c => ({ value: c.iso2, title: c.name }));
  const currencyOptions =
    currencies && currencies.map(c => ({ value: c.code, title: c.name }));
  return (
    <>
      <CountrySelect options={countryOptions} {...fieldProps} />
      <BankAccountCountrySelect options={countryOptions} {...fieldProps} />
      <CurrencySelect options={currencyOptions} {...fieldProps} />
      <TypeSelect {...fieldProps} />
    </>
  );
};

const renderFields = (fields, form) => {
  const filterFields = ([name]) => name !== 'entityType';
  const renderField = ([name, value]) => {
    if (typeof value === 'object') {
      return renderFields(value, form);
    }
    const disabledFields = new Set(['entityType', 'country']);
    const disabled = disabledFields.has(name);
    return (
      <InputItem
        form={form}
        id={name}
        placeholder={startCase(name)}
        label={startCase(name)}
        validationPattern={value}
        key={name}
        required
        disabled={disabled}
      />
    );
  };
  return Object.entries(fields).map(renderField);
};
const MainStepForm = ({ form, fields }) => {
  return (
    <>
      <InputItem
        form={form}
        label="Nickname"
        id="nickname"
        placeholder="Alias for counterparty"
        required
      />
      <InputItem
        form={form}
        label="Email"
        id="email"
        placeholder="Email"
        required
      />
      {renderFields(fields, form)}
    </>
  );
};

const BeneficiaryAddForm = ({ history, form }) => {
  const goToCounterparties = () => {
    history.push('/beneficiaries');
  };

  const [preInfo, setPreInfo] = useState();
  const handleSubmit = async values => {
    const bankAccountFields = [];
    const params = {
      ...values
    };
    const id = await postBeneficiary(params);
    if (id) {
      gotoStep(current + 1);
    }
  };
  const {
    current,
    gotoStep,
    stepsProps,
    formProps,
    submit,
    formValues
  } = useStepsForm({
    submit: handleSubmit,
    form,
    total: 3
  });
  const [mainFormFields, setMainFormFields] = useState();

  const handleNext = () => {
    const values = form.getFieldsValue();
    setPreInfo(values);
    const mainFormFields = getMainFormFields(values);
    if (!mainFormFields) {
      return;
    }
    setMainFormFields(mainFormFields);
    // console.log(values);
    gotoStep(current + 1);
  };

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

  const Step = Steps.Step;
  const layout = {
    labelCol: {
      span: 6
      // xs: { span: 6 },
      // sm: { span: 6 }
    },
    wrapperCol: {
      span: 24
      // xs: { span: 12 },
      // sm: { span: 12 }
    },
    labelAlign: 'left'
    // layout: 'horizontal'
  };
  return (
    <>
      <h1 style={{ marginBottom: '2em' }}>Add new beneficiary</h1>
      <Steps {...stepsProps}>
        <Step title="First Step" />
        <Step title="Second Step" />
        <Step title="Success" />
      </Steps>
      <Form layout="vertical" {...formProps} style={{ margin: '2em 0' }}>
        {current === 0 && (
          <PreStepForm
            form={form}
            countries={countries}
            currencies={currencies}
          />
        )}
        {current === 1 && <MainStepForm form={form} fields={mainFormFields} />}
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
              <Button onClick={goToCounterparties}>
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
