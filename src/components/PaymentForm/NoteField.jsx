import { Form, Input } from 'antd';
import React from 'react';

const NoteField = ({ form }) => {
  const { getFieldDecorator } = form;
  return (
    <Form.Item label="Note">{getFieldDecorator('note')(<Input allowClear />)}</Form.Item>
  );
};

export default NoteField;
