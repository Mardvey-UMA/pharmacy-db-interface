import React from 'react';
import { Tabs, Table, Tag, Descriptions, Spin, Empty } from 'antd';
import { format } from 'date-fns';
import { usePharmacyDetails } from '../../hooks/usePharmacies';
import type { Employee, MedicationInPharmacy, Sale, Supply } from '../../types/pharmacy';

interface PharmacyDetailsProps {
  pharmacyId: number;
}

const PharmacyDetails: React.FC<PharmacyDetailsProps> = ({ pharmacyId }) => {
  const { data: pharmacy, isLoading, error } = usePharmacyDetails(pharmacyId);

  if (isLoading) {
    return <Spin size="large" className="flex justify-center p-8" />;
  }

  if (error || !pharmacy) {
    return <Empty description="Failed to load pharmacy details" />;
  }

  const employeeColumns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Position',
      dataIndex: 'positionDescription',
      key: 'positionDescription',
    },
    {
      title: 'Final Salary',
      dataIndex: 'finalSalary',
      key: 'finalSalary',
      render: (salary: number) => `$${salary.toFixed(2)}`,
    },
  ];

  const medicationColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Form',
      dataIndex: 'form',
      key: 'form',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Expiration',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      render: (date: string) => format(new Date(date), 'MMM dd, yyyy'),
    },
  ];

  const supplyColumns = [
    {
      title: 'Date',
      dataIndex: 'supplyDate',
      key: 'supplyDate',
      render: (date: string) => format(new Date(date), 'MMM dd, yyyy'),
    },
    {
      title: 'Vendor',
      dataIndex: 'vendorName',
      key: 'vendorName',
    },
    {
      title: 'Status',
      dataIndex: 'accepted',
      key: 'accepted',
      render: (accepted: boolean) => (
        <Tag color={accepted ? 'success' : 'warning'}>
          {accepted ? 'Accepted' : 'Pending'}
        </Tag>
      ),
    },
  ];

  const salesColumns = [
    {
      title: 'Date',
      dataIndex: 'saleDate',
      key: 'saleDate',
      render: (date: string) => format(new Date(date), 'MMM dd, yyyy'),
    },
    {
      title: 'Employee',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'Client',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `$${total.toFixed(2)}`,
    },
  ];

  return (
    <div className="space-y-6">
      <Descriptions title="Pharmacy Information" bordered>
        <Descriptions.Item label="Address">{pharmacy.pharmacyAddress}</Descriptions.Item>
      </Descriptions>

      <Tabs
        defaultActiveKey="employees"
        items={[
          {
            key: 'employees',
            label: 'Employees',
            children: (
              <Table
                columns={employeeColumns}
                dataSource={pharmacy.employees}
                rowKey="id"
                pagination={{ pageSize: 5 }}
              />
            ),
          },
          {
            key: 'medications',
            label: 'Medications',
            children: (
              <Table
                columns={medicationColumns}
                dataSource={pharmacy.medications}
                rowKey="id"
                pagination={{ pageSize: 5 }}
              />
            ),
          },
          {
            key: 'supplies',
            label: 'Supplies',
            children: (
              <Table
                columns={supplyColumns}
                dataSource={pharmacy.supplies}
                rowKey="id"
                pagination={{ pageSize: 5 }}
              />
            ),
          },
          {
            key: 'sales',
            label: 'Sales',
            children: (
              <Table
                columns={salesColumns}
                dataSource={pharmacy.sales}
                rowKey="id"
                pagination={{ pageSize: 5 }}
              />
            ),
          },
        ]}
      />
    </div>
  );
};

export default PharmacyDetails;