import React, { useState, useEffect } from 'react';
import { DatePicker, Table, Button, Select, message } from 'antd';
import useAsync from '../hooks/useAsync';
import { getReports, getReportTypes, createReport } from '../api';
import { formatISODate } from '../util';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Reports = () => {
  const [fetchedReports, setFetchedReports, loadingReports] = useAsync(
    getReports
  );
  const [reports, setReports] = useState([]);
  useEffect(() => {
    if (fetchedReports !== undefined) {
      setReports(fetchedReports.result);
    }
  }, [fetchedReports]);
  const [reportTypes, setReportTypes, loadingTypes] = useAsync(
    getReportTypes,
    []
  );
  const dateFormat = 'd-MM-yyyy';
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
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
      title: 'Period',
      key: 'period',
      render: (text, record) => {
        const { period_start, period_end } = record;
        const formattedStartDate = formatISODate(period_start, dateFormat);
        const formattedEndDate = formatISODate(period_end, dateFormat);
        return `${formattedStartDate} ~ ${formattedEndDate}`;
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date, record) => {
        const formattedDate = formatISODate(date, dateFormat);
        return formattedDate;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => {
        const { download: downloadURL } = record;
        if (downloadURL) {
          return (
            <Button type="link" icon="download" href={record.download}>
              Download
            </Button>
          );
        } else {
          return 'Report is not prepared yet';
        }
      },
    },
  ];

  const [reportType, setReportType] = useState(1);
  const handleReportTypeChange = value => setReportType(value);

  const [periodStart, setPeriodStart] = useState();
  const [periodFinish, setPeriodFinish] = useState();
  const handleRangeChange = (date, dateStrings) => {
    const [start, finish] = dateStrings;
    setPeriodStart(start);
    setPeriodFinish(finish);
  };

  const [sendingCreateRequest, setSendingCreateRequest] = useState(false)
  const handleGenerateClick = async () => {
    setSendingCreateRequest(true)
    await createReport(reportType, periodStart, periodFinish);
    setSendingCreateRequest(false)
    message.info('Request for generating report successfully accepted. Report will shown in table below', 10)
    const updatedReports = await getReports();
    setFetchedReports(updatedReports);
  };

  const generateButtonDisabled = !periodStart || !periodFinish;

  return (
    <>
      <div
        style={{
          marginBottom: '1em',
        }}
      >
        <Select
          value={reportType}
          onChange={handleReportTypeChange}
          style={{ marginRight: '1em', width: '180px' }}
        >
          {reportTypes.map(type => (
            <Option value={type.id} key={type.id}>
              {type.name}
            </Option>
          ))}
        </Select>
        <RangePicker onChange={handleRangeChange} />
        <Button
          type="primary"
          style={{ marginLeft: '1em' }}
          onClick={handleGenerateClick}
          disabled={generateButtonDisabled}
          loading={sendingCreateRequest}
        >
          Generate
        </Button>
      </div>
      <Table
        dataSource={reports}
        columns={columns}
        loading={loadingReports}
        rowKey="id"
      />
    </>
  );
};

export default Reports;
