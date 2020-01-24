import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  DatePicker,
  Table,
  Button,
  Select,
  message,
  Spin,
  Form,
  Input,
  Modal,
  Icon,
} from 'antd';
import useAsync from '../../hooks/useAsync';
import {
  getReports,
  getReportTypes,
  createReport,
  getReportStatuses,
} from '../../api';
import { formatISODate } from '../../util';
import TopTitle from '../../components/TopTitle';

const { RangePicker } = DatePicker;
const { Option } = Select;

const SelectReportType = ({
  reportType,
  reportTypes = [],
  handleReportTypeChange,
}) => {
  const options = reportTypes.map(type => (
    <Option value={type.id} key={type.id}>
      {type.name}
    </Option>
  ));
  const style = { marginRight: '1em' };
  if (options.length === 0) {
    return <Select loading={true} style={style} />;
  }
  return (
    <Select value={reportType} onChange={handleReportTypeChange} style={style}>
      {options}
    </Select>
  );
};

const EmailInputForm = ({
  form,
  sendReport,
  defaultEmail,
  setSendModalVisible,
}) => {
  const handleSubmit = event => {
    event.preventDefault();
    form.validateFields((errors, values) => {
      if (!errors) {
        const { email } = values;
        sendReport(email);
        setSendModalVisible(false);
      }
    });
  };
  return (
    <Form layout="vertical" onSubmit={handleSubmit} hideRequiredMark>
      <Form.Item label="Email">
        {form.getFieldDecorator('email', {
          initialValue: defaultEmail,
          validateFirst: true,
          rules: [
            {
              required: true,
              message: 'Email is required',
            },
            {
              type: 'email',
              message: 'Email is not valid',
            },
          ],
        })(<Input />)}
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit">Send</Button>
      </Form.Item>
    </Form>
  );
};

const WrappedEmailInputForm = Form.create({})(EmailInputForm);

const Reports = () => {
  const [reportStatuses] = useAsync(getReportStatuses, []);
  const [fetchedReports, setFetchedReports, loadingReports] = useAsync(
    getReports
  );
  const [reports, setReports] = useState([]);
  useEffect(() => {
    if (fetchedReports !== undefined) {
      setReports(fetchedReports.result);
    }
  }, [fetchedReports]);

  const dateFormat = 'd-MM-yyyy';
  const dateTimeFormat = `${dateFormat} HH:mm`;
  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: typeId => {
        const type = reportTypes.find(type => type.id === typeId);
        return type?.name;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: statusCode => {
        const statusInfo = reportStatuses.find(
          status => status.code === statusCode
        );
        return <span title={statusInfo?.description}>{statusCode}</span>;
      },
    },
    {
      title: 'Period',
      key: 'period',
      render: (_text, report) => {
        const { period_start, period_end } = report;
        const formattedStartDate = formatISODate(period_start, dateFormat);
        const formattedEndDate = formatISODate(period_end, dateFormat);
        return `${formattedStartDate} ~ ${formattedEndDate}`;
      },
    },
    {
      title: 'Creation Date',
      dataIndex: 'date',
      key: 'date',
      render: date => {
        const formattedDate = formatISODate(date, dateTimeFormat);
        return formattedDate;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, report) => {
        const { download: downloadURL } = report;
        if (report.status === 'SUCCESS' || report.status === 'SENT_TO_MAIL') {
          return (
            <>
              {downloadURL && (
                <Button
                  type="primary"
                  icon="download"
                  download
                  href={downloadURL}
                  title="Download report"
                >
                  Download
                </Button>
              )}
            </>
          );
        }
        if (report.status === 'PREPARE') {
          return <Icon type="loading" />;
        }

        if (report.status === 'FAILED') {
          return <Icon type="warning" />;
        }
      },
    },
  ];

  const [reportTypes] = useAsync(getReportTypes, []);
  const [reportType, setReportType] = useState(1);
  const handleReportTypeChange = value => setReportType(value);

  const [periodStart, setPeriodStart] = useState();
  const [periodFinish, setPeriodFinish] = useState();
  const handleRangeChange = (_, dateStrings) => {
    const [start, finish] = dateStrings;
    setPeriodStart(start);
    setPeriodFinish(finish);
  };

  const defaultEmail = useSelector(state => state.user.email);

  const [sendingReport, setSendingReport] = useState(false);
  const sendReport = async email => {
    setSendingReport(true);
    const response = await createReport(
      reportType,
      periodStart,
      periodFinish,
      email
    );
    setSendingReport(false);

    if (response?.success) {
      message.info(
        'Request for generating report successfully accepted. Report will shown in table below',
        10
      );
      const updatedReports = await getReports();
      setFetchedReports(updatedReports);
    }
  };

  const [sendModalVisible, setSendModalVisible] = useState(false);
  const handleSendClick = () => setSendModalVisible(true);

  const handleModalCancelClick = () => setSendModalVisible(false);

  const sendButtonDisabled = !periodStart || !periodFinish;

  return (
    <Spin size="large" spinning={loadingReports}>
      <TopTitle title="Reports" backButton={false} />
      <div style={{ marginBottom: '2em' }}>
        <h2>Send report</h2>
        <Form layout="inline" style={{ marginTop: '1.2em' }}>
          <Form.Item>
            <SelectReportType
              reportType={reportType}
              reportTypes={reportTypes}
              handleReportTypeChange={handleReportTypeChange}
            />
          </Form.Item>
          <Form.Item>
            <RangePicker onChange={handleRangeChange} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              onClick={handleSendClick}
              disabled={sendButtonDisabled}
              loading={sendingReport}
            >
              Send
            </Button>
          </Form.Item>
        </Form>
      </div>
      <Modal
        footer={null}
        visible={sendModalVisible}
        okText="Send"
        onCancel={handleModalCancelClick}
      >
        <WrappedEmailInputForm
          sendReport={sendReport}
          defaultEmail={defaultEmail}
          setSendModalVisible={setSendModalVisible}
        />
      </Modal>
      <Table
        dataSource={reports}
        columns={columns}
        rowKey="id"
        bordered
        pagination={false}
        footer={() => fetchedReports?.description}
      />
    </Spin>
  );
};

export default Reports;
