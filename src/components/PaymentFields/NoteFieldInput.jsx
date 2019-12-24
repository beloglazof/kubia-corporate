import React from 'react';
import { Input, Form } from 'antd';
import PropTypes from 'prop-types';

const NoteFieldInput = ({ form }) => {
  const { getFieldDecorator } = form;
  return (
    <Form.Item label="Note">
      {getFieldDecorator('note')(<Input allowClear />)}
    </Form.Item>
  );
};

NoteFieldInput.propTypes = {
  form: PropTypes.object.isRequired,
};

export default NoteFieldInput;
