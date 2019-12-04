import { Button, Col, Form, Popconfirm, Row, Table } from 'antd';
import React, { useState } from 'react';
import { addPeople, deletePeople, getPeople } from '../../api';
import InputItem from '../../components/BeneficiaryAddForm/InputItem';
import SearchUserInput from '../../components/SearchUserInput';
import useAsync from '../../hooks/useAsync';

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
    <Row>
      <Col span={24}>
        <h1 style={{ marginBottom: '1em' }}>Linked People</h1>
        <Row type="flex" justify="center">
          <Col span={18}>
            {/* find user in our core */}
            <WrappedAddUserForm handleAdd={handleAdd} />
          </Col>
        </Row>
        <Row type="flex" justify="center" style={{ marginTop: '1em' }}>
          <Col span={24} lg={20}>
            <LinkedPeopleTable people={people} handleDelete={handleDelete} />
          </Col>
        </Row>
      </Col>
    </Row>
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
      rowKey="id"
      loading={!people}
      tableLayout="auto"
      bordered
    />
  );
};

const AddUserForm = ({ form, handleAdd, style }) => {
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
        form.resetFields();
        setFoundUser(null);
      }
    });
  };

  const layoutProps = {
    layout: 'horizontal',
    wrapperCol: { xs: { span: 10 } },
    labelCol: { xs: { span: 6 } }
  };

  const buttonLayoutProps = {
    wrapperCol: { xs: { offset: layoutProps.labelCol.xs.span } }
  };
  return (
    <>
      <h2>Link new user</h2>
      <Form layout="horizontal" style={style} {...layoutProps} hideRequiredMark>
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
            <Form.Item {...buttonLayoutProps}>
              <Button type="primary" disabled={!name} onClick={handleAddClick}>
                Add
              </Button>
            </Form.Item>
          </>
        )}
      </Form>
    </>
  );
};

const WrappedAddUserForm = Form.create()(AddUserForm);
