import { Form, Input } from 'antd';
import React from 'react';

const InputItem = ({
  form,
  id = 'input',
  label = 'Input',
  placeholder = 'Placeholder',
  required = false,
  validationPattern,
  initialValue,
  formItemProps,
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
    initialValue,
    validateTrigger: 'onSubmit'
  };

  const fieldDecorator = form && form.getFieldDecorator(id, fieldConfig);
  return (
    <Form.Item label={label} {...formItemProps}>
      {fieldDecorator(<Input placeholder={placeholder} disabled={disabled} />)}
    </Form.Item>
  );
};

export default InputItem;
