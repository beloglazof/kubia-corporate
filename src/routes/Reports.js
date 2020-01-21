import React, { useState, useEffect } from 'react';
import { DatePicker, Table, Button } from 'antd';
import useAsync from '../hooks/useAsync';
import { getReports, getReportTypes } from '../api';
import { formatISODate } from '../util';

const { RangePicker } = DatePicker;

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
  const [reportTypes, setReportTypes, loadingTypes] = useAsync(getReportTypes);
  const handleRangeChange = (date, dateString) => {
    console.log(date, dateString);
  };
  const dateFormat = 'd-MM-yyyy';
  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: typeId => {
        const type = reportTypes.find(type => type.id === typeId);
        return type.name;
      },
    },
    {
      title: 'Period',
      key: 'name',
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
        return (
          <Button type="link" icon="download" href={record.download} disabled={!record.download}>
            Download
          </Button>
        );
      },
    },
  ];
  return (
    <>
      <div
        style={{
          display: 'flex',
          marginBottom: '1em',
        }}
      >
        <RangePicker onChange={handleRangeChange} />
        <Button type="primary" style={{ marginLeft: '1em' }}>
          Generate
        </Button>
      </div>
      <Table dataSource={reports} columns={columns} loading={loadingReports} />
    </>
  );
};

export default Reports;
