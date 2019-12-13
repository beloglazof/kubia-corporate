import { Form, Input } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

const InputItem = ({
  form,
  id = 'input',
  label = 'Input',
  placeholder = 'Placeholder',
  required = false,
  validationPattern = null,
  initialValue = null,
  formItemProps = {},
  disabled = false
}) => {
  if (!form) return null;
  const rules = [];
  if (required) {
    const requiredRule = { required: true, message: `Please input ${label}` };
    rules.push(requiredRule);
  }
  if (validationPattern) {
    const pattern = new RegExp(validationPattern)
    console.log(validationPattern, pattern.test('123456789'), typeof validationPattern)
    const patternRule = {
      pattern ,
      // message: `Invalid ${label} format`
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

InputItem.propTypes = {
  form: PropTypes.object.isRequired,
  id: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  validationPattern: PropTypes.string,
  initialValue: PropTypes.string,
  formItemProps: PropTypes.object,
  disabled: PropTypes.bool
};

export default InputItem;
