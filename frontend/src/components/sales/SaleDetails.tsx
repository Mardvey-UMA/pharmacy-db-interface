import React from 'react';
import { Descriptions, Table, Spin, Empty } from 'antd';
import { format } from 'date-fns';
import { useSaleDetails } from '../../hooks/useSales';
import type { MedicationShort } from '../../types/sale';

interface SaleDetailsProps {
  saleId: number;
}

const SaleDetails: React.FC<SaleDetailsProps> = ({ saleId }) => {
  const { data: sale, isLoading, error } = useSaleDetails(saleId);

  if (isLoading) {
    return <Spin size="large" className="flex justify-center p-8" />;
  }

  if (error || !sale) {
    return <Empty description="Failed to load sale details" />;
  }

  const columns = [
    {
      title: 'Medication',
      dataIndex: 'name',
      key: 'name',
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
      title: 'Total',
      key: 'total',
      render: (_, record: MedicationShort) => 
        `$${(record.price * record.quantity).toFixed(2)}`,
    },
  ];

  return (
    <div className="space-y-6">
      <Descriptions title="Sale Information" bordered>
        <Descriptions.Item label="Date">
          {format(new Date(sale.saleDate), 'MMM dd, yyyy')}
        </Descriptions.Item>
        <Descriptions.Item label="Time">
          {`${sale.saleTime.hour}:${String(sale.saleTime.minute).padStart(2, '0')}`}
        </Descriptions.Item>
        <Descriptions.Item label="Employee">{sale.employeeName}</Descriptions.Item>
        <Descriptions.Item label="Client">{sale.clientName}</Descriptions.Item>
        <Descriptions.Item label="Total">${sale.total.toFixed(2)}</Descriptions.Item>
      </Descriptions>

      <Table
        title={() => <h3 className="text-lg font-semibold">Items</h3>}
        columns={columns}
        dataSource={sale.items}
        rowKey="name"
        pagination={false}
        summary={(data) => {
          const total = data.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={3}>
                <strong>Total</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <strong>${total.toFixed(2)}</strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </div>
  );
};

export default SaleDetails;