import React from 'react';
import { Form, Input, InputNumber, Select, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useEmployees } from '../../hooks/useEmployees';
import { usePharmacies } from '../../hooks/usePharmacies';
import type { OrderCreateDto } from '../../types/order';

interface OrderFormProps {
  onSubmit: (values: OrderCreateDto) => void;
  loading: boolean;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSubmit, loading }) => {
  const [form] = Form.useForm();
  const { data: employees } = useEmployees();
  const { data: pharmacies } = usePharmacies();

  const handleSubmit = (values: any) => {
    const orderRequest: OrderCreateDto = {
      clientId: values.clientId,
      pharmacyId: values.pharmacyId,
      orderAddress: values.orderAddress,
      medications: values.medications.map((med: any) => ({
        medicationId: med.medicationId,
        quantity: med.quantity,
        price: med.price,
      })),
      assemblerIds: values.assemblerIds,
      courierIds: values.courierIds,
    };
    onSubmit(orderRequest);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ medications: [{}] }}
    >
      <Form.Item
        name="clientId"
        label="Client ID"
        rules={[{ required: true, message: 'Please enter client ID' }]}
      >
        <InputNumber style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="pharmacyId"
        label="Pharmacy"
        rules={[{ required: true, message: 'Please select pharmacy' }]}
      >
        <Select>
          {pharmacies?.map((pharmacy) => (
            <Select.Option key={pharmacy.id} value={pharmacy.id}>
              {pharmacy.pharmacyAddress}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="orderAddress"
        label="Delivery Address"
        rules={[{ required: true, message: 'Please enter delivery address' }]}
      >
        <Input.TextArea rows={2} />
      </Form.Item>

      <Form.List name="medications">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'medicationId']}
                  rules={[{ required: true, message: 'Missing medication' }]}
                >
                  <Select placeholder="Select medication" style={{ width: 200 }}>
                    <Select.Option value={1}>Medication 1</Select.Option>
                    <Select.Option value={2}>Medication 2</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'quantity']}
                  rules={[{ required: true, message: 'Missing quantity' }]}
                >
                  <InputNumber min={1} placeholder="Quantity" />
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'price']}
                  rules={[{ required: true, message: 'Missing price' }]}
                >
                  <InputNumber
                    min={0}
                    step={0.01}
                    placeholder="Price"
                    formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Medication
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item
        name="assemblerIds"
        label="Assemblers"
        rules={[{ required: true, message: 'Please select assemblers' }]}
      >
        <Select mode="multiple">
          {employees?.map((employee) => (
            <Select.Option key={employee.id} value={employee.id}>
              {employee.fullName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="courierIds"
        label="Couriers"
        rules={[{ required: true, message: 'Please select couriers' }]}
      >
        <Select mode="multiple">
          {employees?.map((employee) => (
            <Select.Option key={employee.id} value={employee.id}>
              {employee.fullName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Create Order
        </Button>
      </Form.Item>
    </Form>
  );
};

export default OrderForm;