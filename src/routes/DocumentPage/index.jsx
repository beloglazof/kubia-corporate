import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import { Button, Descriptions, Input, DatePicker, Radio } from 'antd';
import { getDocumentTemplate, getDocument } from '../../api';
import TopTitle from '../../components/TopTitle';
import dayjs from 'dayjs';

import styles from './index.module.css';

const renderTemplateField = fieldData => {
  const { label, type, name, value } = fieldData;
  switch (type) {
    case 'text':
      return (
        <Field name={name} key={name} initialValue={value}>
          {props => (
            <div>
              <span>{label}</span>
              <div>
                <Input
                  value={props.input.value}
                  onChange={props.input.onChange}
                />
              </div>
            </div>
          )}
        </Field>
      );

    case 'date':
      // for antd datepicker because it works with moment.js object
      const onChange = cb => (date, dateString) => cb(dateString);
      return (
        <Field name={name} key={name} initialValue={value}>
          {props => (
            <div>
              <span>{label}</span>
              <div>
                <DatePicker
                  onChange={onChange(props.input.onChange)}
                  defaultValue={dayjs(props.meta.initial)}
                />
              </div>
            </div>
          )}
        </Field>
      );

    case 'radio-group':
      const { values } = fieldData;
      return (
        <Field name={name} key={name}>
          {props => (
            <div>
              <span>{label}</span>
              <div>
                <Radio.Group
                  onChange={props.input.onChange}
                  value={props.input.value}
                >
                  {values.map(({ value, label }) => (
                    <Radio value={value} key={value}>
                      {label}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
            </div>
          )}
        </Field>
      );

    default:
      console.error(`Unknown field type: ${type}`);
      return null;
  }
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
                <div className={styles.submitButtonWrapper}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </div>
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
      console.error('Unknown document status');
      return (
        <div>
          <TopTitle title={name} backButton />
          Work in progress
        </div>
      );
  }
};

export default DocumentPage;
