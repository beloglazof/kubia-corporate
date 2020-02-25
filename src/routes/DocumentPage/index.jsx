import React, { useState } from 'react';
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

const renderNestedTemplate = (template, id) => {
  const templateName = `${template.name} ${id}`;
  return (
    <section className={styles.templateSection} key={id}>
      <h2>{templateName}</h2>
      {renderTemplateFields(template.fields, templateName)}
    </section>
  );
};

function MultipleTemplate({ template }) {
  const [templateList, setTemplateList] = useState([1]);
  const showAddButton = templateList.length < template.entityLimit;
  const handleAdd = () =>
    setTemplateList([...templateList, templateList.length + 1]);

  const showDeleteButton = templateList.length > 1;
  const handleDelete = () =>
    setTemplateList(templateList.filter(id => id !== templateList.length));
  return (
    <>
      {templateList.map(id => renderNestedTemplate(template, id))}
      <div>
        {showDeleteButton && (
          <Button type="danger" icon="delete" onClick={handleDelete}>
            Delete last one
          </Button>
        )}
        {showAddButton && (
          <Button type="primary" icon="plus" onClick={handleAdd}>
            Add another {template.name}
          </Button>
        )}
      </div>
    </>
  );
}

const buildFieldName = (base, parentName, num) => {
  const numberedName = num > 0 ? `${base}${num}` : base;
  const fieldName = parentName ? `${parentName}.${numberedName}` : numberedName;
  return fieldName;
};

const getFieldComponent = (fieldData, parentName, fieldNum) => {
  const { type, label, name, value } = fieldData;
  const fieldName = buildFieldName(name, parentName, fieldNum);

  switch (type) {
    case 'text':
      return (
        <Field name={fieldName} key={fieldName} initialValue={value}>
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
      // for antd datepicker because it use custom onChange
      const onChange = cb => (date, dateString) => cb(dateString);

      return (
        <Field name={fieldName} key={fieldName} initialValue={value}>
          {props => (
            <div className={styles.fieldWrapper}>
              <label>{label}</label>
              <div>
                <DatePicker
                  className={styles.datepicker}
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
        <Field name={fieldName} key={fieldName} initialValue={selectedOption}>
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
        <Field name={fieldName} key={fieldName} initialValue={value}>
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
        <Field name={fieldName} key={fieldName} initialValue={initialValue}>
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
        <Field name={fieldName} key={fieldName} initialValue={selected}>
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
        <Field name={fieldName} key={fieldName}>
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

      switch (template.type) {
        case 'multiple':
          return <MultipleTemplate template={template} />;
        default:
          console.error(`Unknown template type: ${template.type}`);
          return null;
      }

    default:
      console.error(`Unknown field type: ${type}`);
      return null;
  }
};

function TemplateField({ fieldData, parentName }) {
  const { label, name, value, multiple } = fieldData;
  const [fieldList, setFieldList] = useState([1]);
  const showDeleteButton = fieldList.length > 1;
  if (multiple) {
    const handleAdd = () => setFieldList([...fieldList, fieldList.length + 1]);
    const handleDelete = () =>
      setFieldList(fieldList.filter(fieldId => fieldId !== fieldList.length));

    return (
      <div className={styles.multipleField}>
        <div>
          {fieldList.map(num => getFieldComponent(fieldData, parentName, num))}
        </div>

        <div className={styles.fieldActions}>
          <Button
            icon="plus"
            title={`Add another one ${label}`}
            onClick={handleAdd}
          />
          {showDeleteButton && (
            <Button
              icon="minus"
              title={`Delete last one`}
              onClick={handleDelete}
            />
          )}
        </div>
      </div>
    );
  } else {
    return getFieldComponent(fieldData, parentName);
  }
}

const renderTemplateFields = (fields, parentName) => {
  return fields.map(field => (
    <TemplateField fieldData={field} parentName={parentName} />
  ));
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
