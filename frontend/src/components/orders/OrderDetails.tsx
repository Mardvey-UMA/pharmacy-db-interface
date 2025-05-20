import React from 'react';
import { Descriptions, Table, Tag, Spin, Empty } from 'antd';
import { format } from 'date-fns';
import { useOrderDetails } from '../../hooks/useOrders';
import type { OrderMedication } from '../../types/order';

interface OrderDetailsProps {
  orderId: number;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId }) => {
  const { data: order, isLoading, error } = useOrderDetails(orderId);

  if (isLoading) {
    return <Spin size="large" className="flex justify-center p-8" />;
  }

  if (error || !order) {
    return <Empty description="Failed to load order details" />;
  }

  const columns = [
    {
      title: 'Medication',
      dataIndex: 'medicationName',
      key: 'medicationName',
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
      render: (_, record: OrderMedication) =>
        `$${(record.price * record.quantity).toFixed(2)}`,
    },
  ];

  return (
    <div className="space-y-6">
      <Descriptions title="Order Information" bordered>
        <Descriptions.Item label="Order Date">
          {format(new Date(order.orderDate), 'MMM dd, yyyy')}
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={order.status === 'COMPLETED' ? 'success' : 'processing'}>
            {order.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Client">{order.clientName}</Descriptions.Item>
        <Descriptions.Item label="Address">{order.orderAddress}</Descriptions.Item>
        <Descriptions.Item label="Total">${order.total.toFixed(2)}</Descriptions.Item>
      </Descriptions>

      <Table
        title={() => <h3 className="text-lg font-semibold">Order Items</h3>}
        columns={columns}
        dataSource={order.medications}
        rowKey="id"
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

export default OrderDetails;