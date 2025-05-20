import React, { useState } from 'react';
import { Table, Input, Button, Modal, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from '../hooks/useEmployees';
import EmployeeForm from '../components/employees/EmployeeForm';
import { Employee } from '../types/employee';
import { useDebounce } from '../hooks/useDebounce';

const { Search } = Input;

const Employees: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  const { data: employees, isLoading } = useEmployees(debouncedSearch);
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();

  const columns = [
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a: Employee, b: Employee) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Position',
      dataIndex: 'positionDescription',
      key: 'positionDescription',
    },
    {
      title: 'Pharmacy',
      dataIndex: 'pharmacyAddress',
      key: 'pharmacyAddress',
    },
    {
      title: 'Final Salary',
      dataIndex: 'finalSalary',
      key: 'finalSalary',
      render: (salary: number) => `$${salary.toFixed(2)}`,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Employee) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedEmployee(record);
              setIsModalVisible(true);
            }}
          />
          <Popconfirm
            title="Are you sure you want to delete this employee?"
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleSubmit = async (values: any) => {
    if (selectedEmployee) {
      await updateMutation.mutateAsync({ id: selectedEmployee.id, data: values });
    } else {
      await createMutation.mutateAsync(values);
    }
    setIsModalVisible(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <Search
          placeholder="Search employees..."
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedEmployee(null);
            setIsModalVisible(true);
          }}
        >
          Add Employee
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={employees}
        loading={isLoading}
        rowKey="id"
      />

      <Modal
        title={selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setSelectedEmployee(null);
        }}
        footer={null}
      >
        <EmployeeForm
          initialValues={selectedEmployee || undefined}
          onSubmit={handleSubmit}
          loading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  );
};

export default Employees;