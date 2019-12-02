import React, { useState } from 'react';
import SearchUserByPhoneWrapper from '../../components/PaymentForm/SearchUserByPhone';
import { Form, Input, Button, Table, Popconfirm } from 'antd';
import { PHONE_NUMBER_LENGTH } from '../../constants';
import { usersCheck, getPeople, addPeople, deletePeople } from '../../api';
import InputItem from '../../components/BeneficiaryAddForm/InputItem';
import useAsync from '../../hooks/useAsync';

const { Search } = Input;
const LinkedPeople = () => {
  const [people, setPeople] = useAsync(getPeople);
  const handleAdd = async userInfo => {
    await addPeople(userInfo);
    const updatedPeople = await getPeople();
    setPeople(updatedPeople);
  };
  const handleDelete = async peopleId => {
    const deleted = await deletePeople(peopleId);
    if (deleted) {
      setPeople(people.filter(people => people.id !== peopleId));
    }
  };
  return (
    <>
      <h1 style={{ marginBottom: '1em' }}>Linked People</h1>
      {/* find user in our core */}
      <WrappedAddUserForm handleAdd={handleAdd} />
      <LinkedPeopleTable people={people} handleDelete={handleDelete} />
    </>
  );
};

export default LinkedPeople;

const DeleteButton = ({ peopleId, handleDelete }) => {
  const handleClick = () => {
    handleDelete(peopleId);
  };
  return (
    <Popconfirm
      title="Are you sure delete linked user?"
      onConfirm={handleClick}
      okText="Yes"
      cancelText="No"
    >
      <Button type="danger" style={{ marginBottom: 0 }}>
        Delete
      </Button>
    </Popconfirm>
  );
};

const LinkedPeopleTable = ({ people, handleDelete }) => {
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Phone', dataIndex: 'phone', key: 'phoneNumber' },
    {
      title: 'Actions',
      key: 'phone',
      render: (text, record) => (
        <DeleteButton peopleId={record.id} handleDelete={handleDelete} />
      )
    }
  ];
  return (
    <Table
      dataSource={people}
      columns={columns}
      size="small"
      rowKey="id"
      loading={!people}
    />
  );
};

const AddUserForm = ({ form, handleAdd }) => {
  const [foundUser, setFoundUser] = useState();
  const name = form.getFieldValue('name');
  const handleAddClick = () => {
    form.validateFields((errors, values) => {
      if (!errors) {
        handleAdd({
          ...foundUser,
          name: values.name,
          userId: foundUser.id
        });
        form.resetFields()
        setFoundUser(null)
      }

    });
  };
  return (
    <Form layout="inline" hideRequiredMark>
      <h2>Add new people</h2>
      <SearchUserInput form={form} setFoundUser={setFoundUser} />
      {foundUser && (
        <>
          <InputItem
            form={form}
            id="name"
            label="Name"
            placeholder="John (SMM)"
            required
          />
          <Button type="primary" disabled={!name} onClick={handleAddClick}>
            Add
          </Button>
        </>
      )}
    </Form>
  );
};

const WrappedAddUserForm = Form.create()(AddUserForm);

const SearchUserInput = ({ form, setFoundUser }) => {
  return (
    <SearchUserByPhoneWrapper form={form} setFoundUser={setFoundUser}>
      <Search
        inputMode="tel"
        addonBefore="+65"
        pattern="[0-9]*"
        placeholder="Search people by phone"
      />
    </SearchUserByPhoneWrapper>
  );
};
