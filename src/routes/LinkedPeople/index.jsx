//@ts-check
import {
  Button,
  Col,
  Form,
  Popconfirm,
  Row,
  Table,
  message,
  PageHeader,
} from 'antd';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { addPeople, deletePeople, getPeople } from '../../api';
import InputItem from '../../components/InputItem';
import SearchUserInput from '../../components/SearchUserInput';
import useAsync from '../../hooks/useAsync';
import TopTitle from '../../components/TopTitle';

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
  handleDelete: PropTypes.func.isRequired,
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
      ),
    },
  ];
  return (
    <Table
      dataSource={[]}
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
  handleDelete: PropTypes.func.isRequired,
};

const AddUserForm = ({ form, handleAdd }) => {
  const [foundUser, setFoundUser] = useState({});
  const name = form.getFieldValue('name');
  const handleAddClick = () => {
    form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      handleAdd({
        ...foundUser,
        name: values.name,
        userId: foundUser?.id,
      });

      form.resetFields();
      setFoundUser(null);
    });
  };

  const layoutProps = {
    // labelCol: {
    //   xs: { span: 6 },
    //   sm: { span: 5 },
    //   md: { span: 4 },
    //   lg: { span: 4 }
    // },
    wrapperCol: { xs: { span: 14 } },
    labelAlign: 'left',
    layout: 'vertical',
  };

  // const buttonLayoutProps = {
  //   wrapperCol: { xs: { offset: layoutProps.labelCol.xs.span } }
  // };
  return (
    <>
      <h2>Link new user</h2>
      <Form
        style={{ paddingLeft: '1em', marginTop: '1em' }}
        {...layoutProps}
        hideRequiredMark
      >
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
            <Form.Item>
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
  handleAdd: PropTypes.func.isRequired,
};
const WrappedAddUserForm = Form.create()(AddUserForm);

const LinkedPeople = ({ history }) => {
  const [people, setPeople] = useAsync(getPeople, []);
  const handleAdd = async userInfo => {
    const userAdded = await people.find(user => user.phone === userInfo.phone);
    if (userAdded) {
      message.error('User already added');
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
        <TopTitle title="Linked People" backButton={false} />
        <div className="page-content-wrapper">
          <Row>
            <Col span={24}>
              <WrappedAddUserForm handleAdd={handleAdd} />
            </Col>
          </Row>
          <Row style={{ marginTop: '1em' }}>
            <Col span={24}>
              <LinkedPeopleTable people={people} handleDelete={handleDelete} />
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
};

export default LinkedPeople;
