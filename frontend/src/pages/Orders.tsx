import React, { useState } from 'react';
import { Table, Button, Modal, DatePicker, InputNumber, Select, Space } from 'antd';
import { format } from 'date-fns';
import { useOrders, useCreateOrder, useUpdateOrderStatus } from '../hooks/useOrders';
import OrderDetails from '../components/orders/OrderDetails';
import OrderForm from '../components/orders/OrderForm';
import type { Order, OrderFilterDto } from '../types/order';

const { RangePicker } = DatePicker;

const Orders: React.FC = () => {
  const [filter, setFilter] = useState<OrderFilterDto>({});
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isStatusModalVisible, setIsStatusModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: orders, isLoading } = useOrders(filter);
  const createMutation = useCreateOrder();
  const updateStatusMutation = useUpdateOrderStatus();

  const columns = [
    {
      title: 'Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date: string) => format(new Date(date), 'MMM dd, yyyy'),
      sorter: (a: Order, b: Order) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={`px-2 py-1 rounded ${
          status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
          status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {status}
        </span>
      ),
    },
    {
      title: 'Client',
      dataIndex: 'clientName',
      key: 'clientName',
    },
    {
      title: 'Address',
      dataIndex: 'orderAddress',
      key: 'orderAddress',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => `$${total.toFixed(2)}`,
      sorter: (a: Order, b: Order) => a.total - b.total,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Order) => (
        <Space>
          <Button type="link" onClick={() => setSelectedOrderId(record.id)}>
            View Details
          </Button>
          <Button
            type="link"
            onClick={() => {
              setSelectedOrder(record);
              setIsStatusModalVisible(true);
            }}
          >
            Update Status
          </Button>
        </Space>
      ),
    },
  ];

  const handleDateRangeChange = (dates: any) => {
    if (dates) {
      setFilter({
        ...filter,
        fromDate: dates[0].format('YYYY-MM-DD'),
        toDate: dates[1].format('YYYY-MM-DD'),
      });
    } else {
      const { fromDate, toDate, ...rest } = filter;
      setFilter(rest);
    }
  };

  const handleStatusChange = (value: string | null) => {
    if (value) {
      setFilter({ ...filter, status: value });
    } else {
      const { status, ...rest } = filter;
      setFilter(rest);
    }
  };

  const handleSumRangeChange = (type: 'min' | 'max', value: number | null) => {
    if (value !== null) {
      setFilter({ ...filter, [type === 'min' ? 'minSum' : 'maxSum']: value });
    } else {
      const newFilter = { ...filter };
      delete newFilter[type === 'min' ? 'minSum' : 'maxSum'];
      setFilter(newFilter);
    }
  };

  const handleCreateOrder = async (values: any) => {
    await createMutation.mutateAsync(values);
    setIsCreateModalVisible(false);
  };

  const handleUpdateStatus = async (values: any) => {
    if (selectedOrder) {
      await updateStatusMutation.mutateAsync({
        id: selectedOrder.id,
        data: {
          newStatus: values.status,
          courierId: values.courierId,
        },
      });
      setIsStatusModalVisible(false);
      setSelectedOrder(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <Space size="middle">
          <RangePicker onChange={handleDateRangeChange} />
          <Select
            allowClear
            placeholder="Filter by status"
            style={{ width: 150 }}
            onChange={handleStatusChange}
          >
            <Select.Option value="PENDING">Pending</Select.Option>
            <Select.Option value="PROCESSING">Processing</Select.Option>
            <Select.Option value="COMPLETED">Completed</Select.Option>
          </Select>
          <InputNumber
            placeholder="Min sum"
            style={{ width: 120 }}
            onChange={(value) => handleSumRangeChange('min', value)}
          />
          <InputNumber
            placeholder="Max sum"
            style={{ width: 120 }}
            onChange={(value) => handleSumRangeChange('max', value)}
          />
        </Space>
        <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>
          New Order
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        loading={isLoading}
        rowKey="id"
      />

      <Modal
        title="Order Details"
        open={!!selectedOrderId}
        onCancel={() => setSelectedOrderId(null)}
        width={800}
        footer={null}
      >
        {selectedOrderId && <OrderDetails orderId={selectedOrderId} />}
      </Modal>

      <Modal
        title="Create New Order"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        width={800}
        footer={null}
      >
        <OrderForm
          onSubmit={handleCreateOrder}
          loading={createMutation.isPending}
        />
      </Modal>

      <Modal
        title="Update Order Status"
        open={isStatusModalVisible}
        onCancel={() => {
          setIsStatusModalVisible(false);
          setSelectedOrder(null);
        }}
        footer={null}
      >
        <Form
          onFinish={handleUpdateStatus}
          layout="vertical"
        >
          <Form.Item
            name="status"
            label="New Status"
            rules={[{ required: true, message: 'Please select new status' }]}
          >
            <Select>
              <Select.Option value="PENDING">Pending</Select.Option>
              <Select.Option value="PROCESSING">Processing</Select.Option>
              <Select.Option value="COMPLETED">Completed</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="courierId"
            label="Assign Courier"
          >
            <Select allowClear>
              {employees?.map((employee) => (
                <Select.Option key={employee.id} value={employee.id}>
                  {employee.fullName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={updateStatusMutation.isPending}>
              Update Status
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;