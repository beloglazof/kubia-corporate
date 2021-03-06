import React, { useState } from 'react';
import { Button, Collapse, Form, Icon, Input, Modal, Radio } from 'antd';
import { getCardTypeName } from '../Card';
import styles from '../Card/card.module.css';
import { cardsNew, cardsRequestState, getCardsNew } from '../../api';
import { useSelector } from 'react-redux';
const { Panel } = Collapse;



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
      const cardsNew = await getCardsNew(id)
      // setCardState(activationState);
    }, 2000);
  };

  const accountId = useSelector(state => state?.accounts[0]?.id);
  const activateCard = async (assocNumber, pin) => {
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
    const id = await cardsNew(params);
    setRequestId(id);
    // set card state to pending
    setCardState('pending');
    // call state watcher
    activationStateWatcher(id);
  };

  const handleActivateClick = async () => {
    showModal();
    if (isVirtual) {
      await activateCard();
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
        </>
      );
    default:
      return null;
  }
};
// export default InactiveCard;




