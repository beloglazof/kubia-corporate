//@ts-check
import { Button, Col, Form, Popconfirm, Row, Table, message } from 'antd';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { addPeople, deletePeople, getPeople } from '../../api';
import InputItem from '../../components/InputItem';
import SearchUserInput from '../../components/SearchUserInput';
import useAsync from '../../hooks/useAsync';

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

DeleteButton.propTypes = {
  peopleId: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired
}

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

LinkedPeopleTable.propTypes = {
  people: PropTypes.array.isRequired,
  handleDelete: PropTypes.func.isRequired
}

const AddUserForm = ({ form, handleAdd }) => {
  const [foundUser, setFoundUser] = useState();
  const name = form.getFieldValue('name');
  const handleAddClick = () => {
    form.validateFields(async (errors, values) => {
      if (!errors) {
        const addingSuccess = await handleAdd({
          ...foundUser,
          name: values.name,
          userId: foundUser.id
        });
        if (addingSuccess) {
          form.resetFields();
          setFoundUser(null);
        } else {
          message.error('User already added');
        }
      }
    });
  };

  const layoutProps = {
    wrapperCol: { xs: { span: 14 } },
    labelCol: { xs: { span: 6 } }
  };

  const buttonLayoutProps = {
    wrapperCol: { xs: { offset: layoutProps.labelCol.xs.span } }
  };
  return (
    <>
      <h2>Link new user</h2>
      <Form {...layoutProps} hideRequiredMark>
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


AddUserForm.propTypes = {
  form: PropTypes.object.isRequired,
  handleAdd: PropTypes.func.isRequired
}
const WrappedAddUserForm = Form.create()(AddUserForm);

const LinkedPeople = () => {
  const [people, setPeople] = useAsync(getPeople);
  const handleAdd = async userInfo => {
    const userAdded = people.find(user => user.phone === userInfo.phone);
    if (userAdded) {
      return false;
    }
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
            <WrappedAddUserForm
              // @ts-ignore
              handleAdd={handleAdd}
            />
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
