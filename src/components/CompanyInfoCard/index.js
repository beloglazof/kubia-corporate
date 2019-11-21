import React from 'react';
import useAsync from '../../hooks/useAsync';
import { getCompanies, getCompanyFields } from '../../api';
import { Card, Descriptions } from 'antd';
import { useSelector } from 'react-redux';

const renderFields = (fields, values) => {
  if (!fields || !values) return null;
  return values.map(value => {
    const field = fields.find(field => field.id === value.id);
    if (!field) return null;
    return (
      <Descriptions.Item label={field.name} key={field.id}>
        {value.value}
      </Descriptions.Item>
    );
  });
};

const CompanyInfoCard = props => {
  const user = useSelector(state => state.user);
  const companyFields = useAsync(getCompanyFields);
  const companies = useAsync(getCompanies);
  const currentCompany = companies && companies[0];
  const fieldValues = currentCompany?.fields;
  const titleStyles = {
    fontSize: '1.7em'
  };
  const loading = !currentCompany || !companyFields;
  return (
    <Card
      loading={loading}
      title={currentCompany?.name}
      headStyle={titleStyles}
      style={{ marginTop: '16px' }}
    >
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Manager">
          {user.first_name} {user.last_name}
        </Descriptions.Item>
        {renderFields(companyFields, fieldValues)}
      </Descriptions>
    </Card>
  );
};

export default CompanyInfoCard;
