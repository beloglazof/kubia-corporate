import React, { useState } from 'react';
import { Button, Collapse, Form, Icon, Input, Modal, Radio } from 'antd';
import { getCardTypeName } from '../Card';
import styles from '../Card/card.module.css';
import { cardsNew, cardsRequestState, getCardsNew } from '../../api';
import { useSelector } from 'react-redux';
const { Panel } = Collapse;

const CreateForm = Form.create({ name: 'form_in_modal' })(
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

const CardShortInfo = ({ typeName, handleActivateClick }) => {
  return (
    <div className={`${styles.shortInfo}`}>
      <span className={styles.typeName}>{typeName}</span>
      <Icon type="credit-card" className={styles.creditCardIcon} />
      <Button style={{ marginBottom: 0 }} onClick={handleActivateClick}>
        Activate your {typeName.toLowerCase()} card
      </Button>
    </div>
  );
};
const InactiveCard = ({ typeId }) => {
  const [cardState, setCardState] = useState('inactive');
  const [requestId, setRequestId] = useState();
  const [modalOpen, setModalOpen] = useState(false);

  const showModal = () => {
    setModalOpen(true);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  let formRef;
  const saveFormRef = ref => {
    formRef = ref;
  };

  const handleCreate = () => {
    const { form } = formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const { assocNum, pin } = values;
      console.log('Received values of form: ', values);
      activateCard(assocNum, pin);
      form.resetFields();
      setModalOpen(false);
    });
  };

  const typeName = getCardTypeName(typeId);
  const isVirtual = typeName.toLowerCase() === 'virtual';

  let watcherIntervalId;
  const activationStateWatcher = (id) => {
    watcherIntervalId = setInterval(async () => {
      // const activationState = await cardsRequestState();
      const cardsNew = await getCardsNew()
      // setCardState(activationState);
    }, 2000);
  };

  const accountId = useSelector(state => state?.accounts[0]?.id);
  const activateCard = (assocNumber, pin) => {
    // send request -> get request id
    const virtualCardParams = {
      account_id: accountId,
      type_id: typeId
    };
    const physicalCardParams = {
      ...virtualCardParams,
      assoc_number: assocNumber,
      pin
    };

    const params = isVirtual ? virtualCardParams : physicalCardParams;
    const id = cardsNew(params);
    setRequestId(id);
    // set card state to pending
    setCardState('pending');
    // call state watcher
    activationStateWatcher(id);
  };

  const handleActivateClick = () => {
    showModal();
    if (isVirtual) {
      activateCard();
    }
  };
  switch (cardState) {
    case 'inactive':
      return (
        <>
          <Collapse expandIconPosition="right" expandIcon={() => {}}>
            <Panel
              key={typeId}
              header={
                <CardShortInfo
                  typeName={typeName}
                  handleActivateClick={handleActivateClick}
                />
              }
              disabled
            />
          </Collapse>
          {typeName.toLowerCase() === 'physical' && (
            <CreateForm
              wrappedComponentRef={saveFormRef}
              visible={modalOpen}
              onCancel={handleCancel}
              onCreate={handleCreate}
            />
          )}
        </>
      );
    default:
      return null;
  }
};
export default InactiveCard;
