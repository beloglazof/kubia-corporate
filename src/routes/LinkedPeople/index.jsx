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
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatPhoneNumberIntl } from 'react-phone-number-input';
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
    { title: 'Name', dataIndex: 'name', key: 'name', ellipsis: true },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phoneNumber',
      render: (phoneNumber, record) => {
        const formatted = formatPhoneNumberIntl(
          `+${record.code}${phoneNumber}`
        );
        return formatted;
      },
    },
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
      dataSource={people}
      columns={columns}
      rowKey="id"
      loading={!people}
      tableLayout="fixed"
      bordered
    />
  );
};

LinkedPeopleTable.propTypes = {
  people: PropTypes.array.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

const AddUserForm = ({ form, handleAdd }) => {
  const [foundUser, setFoundUser] = useState({ name: '', id: '' });
  const [name, setName] = useState('');
  useEffect(() => {
    if (foundUser && foundUser.name) {
      setName(foundUser.name);
    }
  }, [foundUser]);
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
    wrapperCol: { xs: { span: 14 } },
    labelAlign: 'left',
    layout: 'vertical',
  };

  return (
    <>
      <h2>Link user</h2>
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
              initialValue={name}
              inputProps={{ style: { width: '300px' } }}
              style={{ marginBottom: '1em' }}
              required
            />
            <Form.Item>
              <Button icon="user-add" type="primary" disabled={!name} onClick={handleAddClick}>
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
