import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import {
  Button,
  Descriptions,
  Input,
  DatePicker,
  Radio,
  InputNumber,
  Select,
  Upload,
  Icon,
  Checkbox,
} from 'antd';
import dayjs from 'dayjs';

import { getDocumentTemplate, getDocument, uploadDoc } from '../../api';
import TopTitle from '../../components/TopTitle';

import styles from './index.module.css';

const renderTemplateField = fieldData => {
  const { label, type, name, value } = fieldData;
  switch (type) {
    case 'text':
      return (
        <Field name={name} key={name} initialValue={value}>
          {props => (
            <div className={styles.fieldWrapper}>
              <label>{label}</label>
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
            <div className={styles.fieldWrapper}>
              <label>{label}</label>
              <div>
                <DatePicker
                  onChange={onChange(props.input.onChange)}
                  defaultValue={props.meta.initial && dayjs(props.meta.initial)}
                />
              </div>
            </div>
          )}
        </Field>
      );

    case 'radio-group':
      const { values } = fieldData;
      const selectedOption = values.find(({ selected }) => selected).value;

      return (
        <Field name={name} key={name} initialValue={selectedOption}>
          {props => (
            <div className={styles.fieldWrapper}>
              <label>{label}</label>
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

    case 'number':
      return (
        <Field name={name} key={name} initialValue={value}>
          {props => (
            <div className={styles.fieldWrapper}>
              <label>{label}</label>
              <div>
                <InputNumber
                  onChange={props.input.onChange}
                  value={props.input.value}
                />
              </div>
            </div>
          )}
        </Field>
      );

    case 'select':
      const { Option } = Select;
      const options = fieldData.values;
      const initialValue = options.find(v => v.selected).value;
      return (
        <Field name={name} key={name} initialValue={initialValue}>
          {props => (
            <div className={styles.fieldWrapper}>
              <label>{label}</label>
              <div>
                <Select
                  defaultValue={props.meta.initial}
                  onChange={props.input.onChange}
                >
                  {options.map(({ value, label }) => (
                    <Option value={value} key={value}>
                      {label}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          )}
        </Field>
      );

    case 'checkbox-group':
      const selected = fieldData.values
        .filter(v => v.selected)
        .map(v => v.value);

      return (
        <Field name={name} key={name} initialValue={selected}>
          {props => (
            <div className={styles.fieldWrapper}>
              <label>{label}</label>
              <div>
                <Checkbox.Group
                  onChange={props.input.onChange}
                  options={fieldData.values}
                  defaultValue={props.meta.initial}
                />
              </div>
            </div>
          )}
        </Field>
      );

    case 'file':
      let fileId;
      const upload = async ({ file, onProgress, onError, onSuccess }) => {
        const uploaded = await uploadDoc(file);
        if (uploaded) {
          const { file_id } = uploaded;
          fileId = file_id;
          // setFileId(file_id);
          onSuccess();
        } else {
          onError();
        }
      };

      const onUploadChange = cb => info => {
        if (info.file.status === 'done') {
          cb(fileId);
        } else if (info.file.status === 'error') {
          console.error(`${info.file.name} file upload failed.`);
        }
      };

      return (
        <Field name={name} key={name}>
          {props => (
            <div className={styles.fieldWrapper}>
              <label>{label}</label>
              <div>
                <Upload
                  customRequest={upload}
                  onChange={onUploadChange(props.input.onChange)}
                >
                  <Button type="primary">
                    <Icon type="upload" /> Click to Upload
                  </Button>
                </Upload>
              </div>
            </div>
          )}
        </Field>
      );

    case 'template':
      const { templateId } = fieldData;
      const template = getDocumentTemplate(templateId);
      return (
        <section className={styles.templateSection}>
          <h2>{template.name}</h2>
          {renderTemplateFields(template.fields)}
        </section>
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
