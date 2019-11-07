import { Form, Input, Modal } from 'antd';
import React from 'react';

const PhysicalCardActivationModal = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Input card info"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Associated number">
              {getFieldDecorator('assocNum', {
                rules: [
                  {
                    required: true,
                    message:
                      'Please input the associated number from your card!'
                  }
                ]
              })(<Input />)}
            </Form.Item>
            <Form.Item label="PIN">
              {getFieldDecorator('pin', {
                rules: [
                  {
                    required: true,
                    message: 'Please set the pin code!'
                  }
                ]
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

export default PhysicalCardActivationModal;
