import React from 'react';
import PropTypes from 'prop-types';
import TopTitle from '../../components/TopTitle';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

const Payrolls = props => {
  return (
    <div>
      <TopTitle title="Payrolls" />
      <Button type="primary">
        <Link to="/payrolls/new">New Payroll</Link>
      </Button>
      <Button type="primary">Payroll list</Button>
    </div>
  );
};

Payrolls.propTypes = {};

export default Payrolls;
