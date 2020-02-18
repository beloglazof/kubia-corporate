import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getDocumentTemplate, getDocument } from '../../api';
import TopTitle from '../../components/TopTitle';
import { Form } from 'react-final-form';
import { Button, Descriptions } from 'antd';

const renderTemplateField = fieldData => {
  return fieldData.label;
};

const renderTemplateFields = fields => {
  return fields.map(renderTemplateField);
};

const renderFieldsData = fields => {
  return fields.map(({ label, value }) => {
    if (value) {
      return (
        <Descriptions.Item label={label} key={label}>
          {value}
        </Descriptions.Item>
      );
    } else {
      return <Descriptions.Item label={label} key={label} />;
    }
  });
};

const DocumentPage = () => {
  const { id: documentId } = useParams();
  const docData = getDocument(documentId);
  const { status, name, fields } = docData;

  switch (status) {
    case 'new':
      const location = useLocation();
      const { templateId } = location.state;
      const template = getDocumentTemplate(templateId);
      const fieldComponents = renderTemplateFields(template.fields);
      const handleSubmit = values => console.log(values);

      return (
        <div>
          <TopTitle title={name} backButton />
          <Form onSubmit={handleSubmit}>
            {props => (
              <form onSubmit={props.handleSubmit}>
                {fieldComponents}
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </form>
            )}
          </Form>
        </div>
      );

    case 'checked':
      return (
        <div>
          <TopTitle title={name} backButton />
          <Descriptions>{renderFieldsData(fields)}</Descriptions>
        </div>
      );

    default:
      console.error('unknown document status');
      return (
        <div>
          <TopTitle title={name} backButton />
          Work in progress
        </div>
      );
  }
};

export default DocumentPage;
