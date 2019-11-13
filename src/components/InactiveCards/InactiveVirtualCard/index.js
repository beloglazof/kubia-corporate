import React, { useEffect, useState } from 'react';
import {
  Button,
  Collapse,
  Form,
  Input,
  InputNumber,
  message,
  Modal
} from 'antd';
import CardInfo from '../CardInfo';
import { useDispatch, useSelector } from 'react-redux';
import { cardsNew, getCardsNew, getNewOTP, patchCardsOTP } from '../../../api';
import cardStates from '../../../constants/cardStates';
import { fetchMainScreen } from '../../../redux/features/screens/screensSlice';

const InputOTP = Form.create({ name: 'input-otp' })(
  // eslint-disable-next-line
  class extends React.Component {
    handleSubmit = e => {
      e.preventDefault();
      const { sendOTP, form } = this.props;
      form.validateFields((errors, values) => {
        if (errors) {
          message.error('Error with code from sms');
          return;
        }
        const { code } = values;
        sendOTP(code);
      });
    };
    render() {
      const {
        visible,
        onCancel,
        onCreate,
        form,
        handleGetNewCode
      } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Form layout="inline" onSubmit={this.handleSubmit} hideRequiredMark>
          <Form.Item label="Code" style={{ marginBottom: 0 }}>
            {getFieldDecorator('code', {
              rules: [
                {
                  required: true,
                  message: 'Please input code from sms!'
                }
              ]
            })(<Input size={'small'} />)}
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button style={{ marginBottom: '0' }} htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              style={{ marginBottom: '0' }}
              size={'small'}
              onClick={handleGetNewCode}
            >
              Get new code
            </Button>
          </Form.Item>
        </Form>
      );
    }
  }
);

const InactiveVirtualCard = () => {
  const dispatch = useDispatch();
  const [cardState, setCardState] = useState('INACTIVE');
  const [requestId, setRequestId] = useState();

  const storageRequestId = parseInt(
    localStorage.getItem('virtualCardRequestId'),
    10
  );
  useEffect(() => {
    if (storageRequestId) {
      setRequestId(storageRequestId);
      const updateState = async () => {
        const fetchedCardState = await getCardsNew(storageRequestId);
        const { result } = fetchedCardState;
        if (!result) {
          return;
        }
        const [{ state_id }] = result;
        if (!state_id) {
          setCardState('OTP');
          return;
        }
        const { name } = cardStates.find(state => state.id === state_id);
        setCardState(name);
      };
      updateState();
    }
  }, []);
  const typeId = 1;
  const accountId = useSelector(state => state?.accounts[0]?.id);

  let watcherIntervalId;
  const stateWatcher = id => {
    watcherIntervalId = setInterval(async () => {
      const response = await getCardsNew(id);
    }, 10000);
  };
  const activateCard = async () => {
    const params = {
      account_id: accountId,
      type_id: typeId
    };
    const id = await cardsNew(params);
    setRequestId(id);
    localStorage.setItem('virtualCardRequestId', id.toString());
    setCardState('OTP');
  };
  const handleActivateClick = async () => {
    await activateCard();
  };
  const sendOTP = async otp => {
    const params = {
      request_id: requestId,
      otp
    };
    const isOTPCorrect = await patchCardsOTP(params);
    if (!isOTPCorrect) {
      return;
    }
    localStorage.removeItem('virtualCardRequestId');
    dispatch(fetchMainScreen());
    // setCardState('PENDING');
    // stateWatcher(requestId);
  };

  const getNewCode = async () => {
    const params = {
      request_id: requestId
    };
    await getNewOTP(params);
  };

  let Header;
  switch (cardState) {
    case 'INACTIVE':
      Header = (
        <CardInfo
          typeName={'virtual'}
          handleActivateClick={handleActivateClick}
        />
      );
      break;
    case 'OTP':
      Header = <InputOTP sendOTP={sendOTP} handleGetNewCode={getNewCode} />;
      break;
    default:
      Header = null;
  }

  return (
    <Collapse expandIconPosition="right" expandIcon={() => {}}>
      <Collapse.Panel key={typeId} header={Header} disabled />
    </Collapse>
  );
};

export default InactiveVirtualCard;
