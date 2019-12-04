import { Form, Select } from 'antd';
import React from 'react';
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
  ...selectProps
}) => {
  if (!form) return null;
  const rules = [];
  if (selectProps.required) {
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

export default SelectItem;
