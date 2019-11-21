import React from 'react';
import SelectItem from '../BeneficiaryAddForm/SelectItem';
import useAsync from '../../hooks/useAsync';
import { getBeneficiary } from '../../api';

const RemittanceRecipientFields = ({ form }) => {
  // return (
  //   <React.Fragment>
  //     <Form.Item label="SWIFT">
  //       {getFieldDecorator('swift', {
  //         rules: [
  //           { required: true, message: 'Please enter recipient bank SWIFT' }
  //         ]
  //       })(<Input />)}
  //     </Form.Item>
  //     <Form.Item label="Account id">
  //       {getFieldDecorator('accountId', {
  //         rules: [
  //           { required: true, message: 'Please enter recipient account id' }
  //         ]
  //       })(<Input />)}
  //     </Form.Item>
  //     <Form.Item label="Bank name">
  //       {getFieldDecorator('bankName')(<Input />)}
  //     </Form.Item>
  //     <Form.Item label="Bank code">
  //       {getFieldDecorator('bankCode', {
  //         rules: [
  //           { required: true, message: 'Please enter recipient bank code' }
  //         ]
  //       })(<Input />)}
  //     </Form.Item>
  //     <Form.Item label="Bank branch code">
  //       {getFieldDecorator('bankBranchCode')(<Input />)}
  //     </Form.Item>
  //     <Form.Item label="Bank address">
  //       {getFieldDecorator('bankAddress')(<Input />)}
  //     </Form.Item>
  //   </React.Fragment>
  // );

  return (
    <>
      <SelectBeneficiary form={form} />
    </>
  );
};

export default RemittanceRecipientFields;
const SelectBeneficiary = ({ form }) => {
  const beneficiaries = useAsync(getBeneficiary);
  const options = beneficiaries
    ? beneficiaries
        .filter(counterparty => counterparty.accountNumber)
        .map(b => {
          const { nickname, email, accountNumber, id } = b;
          const option = {
            value: id,
            title: `Alias: ${nickname}`
          };

          if (!nickname) {
            option.title = email
              ? `Email: ${email}`
              : `Account Number: ${accountNumber}`;
          }

          return option;
        })
    : [];

  return (
    <SelectItem
      form={form}
      label="Beneficiary"
      id="beneficiary"
      options={options}
    />
  );
};
