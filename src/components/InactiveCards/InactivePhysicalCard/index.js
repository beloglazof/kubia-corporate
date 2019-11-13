import { Collapse, Form, Input, Modal } from 'antd';
import CardInfo from '../CardInfo';
import React, { useState } from 'react';
import { cardsNew } from '../../../api';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMainScreen } from '../../../redux/features/screens/screensSlice';
import PhysicalCardActivationModal from '../../PhysicalCardActivationModal';



const InactivePhysicalCard = () => {
  const typeId = 2;
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
  const accountId = useSelector(state => state?.accounts[0]?.id);
  const activateCard = async (assocNumber, pin) => {
    const params = {
      account_id: accountId,
      type_id: typeId,
      assoc_number: assocNumber,
      pin
    };

    return await cardsNew(params);
  };

  const dispatch = useDispatch();
  const handleCreate = () => {
    const { form } = formRef.props;
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      const { assocNum, pin } = values;
      // console.log('Received values of form: ', values);
      await activateCard(assocNum, pin);
      form.resetFields();
      setModalOpen(false);
      dispatch(fetchMainScreen());
    });
  };

  return (
    <>
      <Collapse expandIconPosition="right" expandIcon={() => {}}>
        <Collapse.Panel
          key={typeId}
          header={
            <CardInfo typeName={'physical'} handleActivateClick={showModal} />
          }
          disabled
        />
      </Collapse>
      <PhysicalCardActivationModal
        wrappedComponentRef={saveFormRef}
        visible={modalOpen}
        onCancel={handleCancel}
        onCreate={handleCreate}
      />
    </>
  );
};

export default InactivePhysicalCard;
