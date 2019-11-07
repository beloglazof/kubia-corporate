import React from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Col,
  Descriptions,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Radio,
  Row,
  Select
} from "antd";
import { paymentsPay, usersCheck, withdrawal } from "../../api";
import { startCase } from "lodash/string";
import getRandomString from "../../util/getRandomString";

const FormItem = Form.Item;

const renderAccountOptions = account => {
  const { number, amount, id } = account;
  const title = `${number} | Balance: S$ ${amount}`;
  return (
    <Select.Option value={account} key={id}>
      {title}
    </Select.Option>
  );
};

const AccountField = ({ accounts, form }) => {
  const { getFieldDecorator } = form;

  return (
    <FormItem label="Account" hasFeedback>
      {getFieldDecorator("account", {
        rules: [{ required: true, message: "Account is not selected!" }]
      })(
        <Select placeholder="Please select account">
          {accounts && accounts.map(renderAccountOptions)}
        </Select>
      )}
    </FormItem>
  );
};

const AmountField = ({ balance, form }) => {
  const { getFieldDecorator } = form;
  const greaterThanZero = (rule, value, callback) => {
    if (value > 0) {
      return callback();
    }
    callback("Amount must be greater than zero");
  };

  const formatter = value =>
    `S$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const parser = value => value.replace(/S\$\s?|(,*)/g, "");
  return (
    <FormItem label="Amount" hasFeedback>
      {getFieldDecorator("amount", {
        rules: [
          { required: true, message: "Please enter amount!" },
          { validator: greaterThanZero }
        ]
      })(
        <InputNumber
          formatter={formatter}
          parser={parser}
          min={0}
          max={balance}
          step={0.1}
        />
      )}
    </FormItem>
  );
};

const NoteField = ({ form }) => {
  const { getFieldDecorator } = form;
  return (
    <FormItem label="Note">{getFieldDecorator("note")(<Input />)}</FormItem>
  );
};

const RecipientPhoneField = ({ form }) => {
  const { getFieldDecorator } = form;

  const validatePhone = async (rule, value, callback) => {
    const user = await usersCheck(value, false);
    if (user) {
      callback();
    } else {
      callback("Phone not found");
    }
  };
  return (
    <FormItem label="Phone Number" hasFeedback>
      {getFieldDecorator("phone", {
        rules: [
          { required: true, message: "Please input recipient phone number!" },
          { validator: validatePhone }
        ]
      })(<Input />)}
    </FormItem>
  );
};

const ExternalRecipientFields = ({ form }) => {
  const { getFieldDecorator } = form;

  return (
    <React.Fragment>
      <FormItem label="SWIFT">
        {getFieldDecorator("swift", {
          rules: [
            { required: true, message: "Please enter recipient bank SWIFT" }
          ]
        })(<Input />)}
      </FormItem>
      <FormItem label="Account id">
        {getFieldDecorator("accountId", {
          rules: [
            { required: true, message: "Please enter recipient account id" }
          ]
        })(<Input />)}
      </FormItem>
      <FormItem label="Bank name">
        {getFieldDecorator("bankName")(<Input />)}
      </FormItem>
      <FormItem label="Bank code">
        {getFieldDecorator("bankCode", {
          rules: [
            { required: true, message: "Please enter recipient bank code" }
          ]
        })(<Input />)}
      </FormItem>
      <FormItem label="Bank branch code">
        {getFieldDecorator("bankBranchCode")(<Input />)}
      </FormItem>
      <FormItem label="Bank address">
        {getFieldDecorator("bankAddress")(<Input />)}
      </FormItem>
    </React.Fragment>
  );
};

const renderRecipientFields = (paymentType, form) => {
  switch (paymentType) {
    case "internal":
      return <RecipientPhoneField form={form} />;
    case "remittance":
      return <ExternalRecipientFields form={form} />;
    default:
      return null;
  }
};

const PaymentData = ({ form }) => {
  const { getFieldsValue } = form;
  const fields = getFieldsValue();
  const renderFields = () => {
    return Object.entries(fields).map(field => {
      const [fieldName, fieldValue] = field;
      const name = startCase(fieldName);
      let value;
      switch (fieldName) {
        case "account":
          value = fieldValue.number;
          break;
        case "amount":
          value = `S$ ${fieldValue}`;
          break;
        case "paymentType":
          value = startCase(fieldValue);
          break;
        default:
          value = fieldValue;
          break;
      }
      return (
        <Descriptions.Item label={name} key={name}>
          <span style={{ fontWeight: "500" }}>{value}</span>
        </Descriptions.Item>
      );
    });
  };
  return <Descriptions column={1}>{renderFields()}</Descriptions>;
};
const NewPaymentForm = ({ form, history }) => {
  const accounts = useSelector(state => state.accounts);

  const {
    getFieldDecorator,
    getFieldsValue,
    getFieldValue,
    validateFields
  } = form;

  const paymentType = getFieldValue("paymentType");
  const account = getFieldValue("account");
  const balance = account ? account.amount : 0;
  const amount = getFieldValue("amount");

  const sendPaymentRequest = async () => {
    const {
      amount,
      account,
      note,
      phone,
      swift,
      bankCode,
      bankName,
      bankAddress,
      bankBranchCode,
      accountId
    } = getFieldsValue();

    const account_id = account.id;
    const idempotency = getRandomString();
    let params;
    let request;
    if (paymentType === "internal") {
      const recipientUser = await usersCheck(phone);
      const user_id = recipientUser.id;
      params = {
        amount,
        account_id,
        user_id,
        description: note ? note : "",
        idempotency
      };
      request = paymentsPay;
    }
    if (paymentType === "remittance") {
      params = {
        amount,
        account_id,
        notes: note ? note : "",
        withdrawal_type: 1,
        idempotency,
        recipient: {
          swift,
          bank_code: bankCode,
          bank_account_id: accountId,
          branch_code: bankBranchCode,
          bank_address: bankAddress,
          bank_name: bankName
        }
      };
      request = withdrawal;
    }

    try {
      const response = await request(params);
      if (response) {
        message.success("We executing your payment request now");
        history.push("/");
      }
    } catch (error) {
      const err = error.response.data.error[0];
      const msg = `${err.message} ${err.code}`;
      message.error(msg);
    }
  };
  const handleSubmit = e => {
    e.preventDefault();
    validateFields(errors => {
      if (!errors) {
        Modal.confirm({
          title: "Is payment data correct?",
          content: <PaymentData form={form} />,
          onOk: sendPaymentRequest,
          onCancel() {}
        });
      }
    });
  };

  const accountFieldProps = {
    accounts,
    form
  };

  const amountFieldProps = {
    balance,
    form
  };

  const formLayoutProps = {
    layout: "horizontal",

    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 12 }
    },
    labelCol: {
      xs: { span: 12 },
      sm: { span: 6 }
    }
  };

  return (
    <Row>
      <Col span={24}>
        <h2>New Payment</h2>
        <Form onSubmit={handleSubmit} {...formLayoutProps}>
          <FormItem label="Payment Type">
            {getFieldDecorator("paymentType", {
              rules: [
                { required: true, message: "Please choose payment type!" }
              ]
            })(
              <Radio.Group>
                <Radio.Button value="internal">Internal</Radio.Button>
                <Radio.Button value="remittance">Remittance</Radio.Button>
              </Radio.Group>
            )}
          </FormItem>
          {paymentType && <AccountField {...accountFieldProps} />}
          {account && (
            <>
              <AmountField {...amountFieldProps} />
              <NoteField form={form} />
            </>
          )}
          {amount > 0 && renderRecipientFields(paymentType, form)}
          <FormItem wrapperCol={{ span: 6, offset: 6 }}>
            <Button htmlType="submit" type="primary">
              Submit
            </Button>
          </FormItem>
        </Form>
      </Col>
    </Row>
  );
};

const NewPayment = Form.create()(NewPaymentForm);
export default NewPayment;
