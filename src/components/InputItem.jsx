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
  disabled = false,
  validators = [],
  formItemProps = {},
  inputProps = {},
  style = {},
}) => {
  if (!form) return null;
  const rules = [];
  if (required) {
    const requiredRule = { required: true, message: `Please input ${label}` };
    rules.push(requiredRule);
  }
  if (validationPattern) {
    const pattern = new RegExp(validationPattern);
    const patternRule = {
      pattern,
      message: `Invalid ${label} format`,
    };
    rules.push(patternRule);
  }
  if (validators.length > 0) {
    const validatorRules = validators.map(validator => ({ validator }));
    rules.push(...validatorRules);
  }
  const fieldConfig = {
    rules,
    initialValue,
    validateTrigger: 'onSubmit',
  };

  const fieldDecorator = form && form.getFieldDecorator(id, fieldConfig);
  return (
    <Form.Item label={label} {...formItemProps} style={style}>
      {fieldDecorator(
        <Input placeholder={placeholder} disabled={disabled} {...inputProps} />
      )}
    </Form.Item>
  );
};

InputItem.propTypes = {
  form: PropTypes.object.isRequired,
  id: PropTypes.string,
  label: PropTypes.string || PropTypes.element,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  validationPattern: PropTypes.string,
  initialValue: PropTypes.string,
  formItemProps: PropTypes.object,
  disabled: PropTypes.bool,
};

export default InputItem;
