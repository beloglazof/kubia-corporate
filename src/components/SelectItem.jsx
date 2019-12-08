import { Form, Select } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

const { Option } = Select;

const renderOption = ({ value, title }) => (
  <Option value={value} key={value}>
    {title}
  </Option>
);

const SelectItem = ({
  form,
  label,
  id,
  options,
  initialValue,
  required,
  selectProps
}) => {
  if (!form) return null;
  const rules = [];
  if (required) {
    const requiredRule = { required: true, message: `Please select ${label}` };
    rules.push(requiredRule);
  }

  return (
    <Form.Item label={label}>
      {form.getFieldDecorator(id, { rules, initialValue })(
        <Select {...selectProps}>{options.map(renderOption)}</Select>
      )}
    </Form.Item>
  );
};

SelectItem.propTypes = {
  form: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  initialValue: PropTypes.string,
}

export default SelectItem;
