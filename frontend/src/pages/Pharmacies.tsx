import React, { useState } from 'react';
import { Table, Input, Modal, Spin } from 'antd';
import { usePharmacies } from '../hooks/usePharmacies';
import PharmacyDetails from '../components/pharmacies/PharmacyDetails';
import type { Pharmacy } from '../types/pharmacy';

const { Search } = Input;

const Pharmacies: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<number | null>(null);
  
  const { data: pharmacies, isLoading } = usePharmacies(searchTerm);

  const columns = [
    {
      title: 'Address',
      dataIndex: 'pharmacyAddress',
      key: 'pharmacyAddress',
      sorter: (a: Pharmacy, b: Pharmacy) => 
        a.pharmacyAddress.localeCompare(b.pharmacyAddress),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Pharmacy) => (
        <a onClick={() => setSelectedPharmacyId(record.id)}>View Details</a>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Search
          placeholder="Search pharmacies..."
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={pharmacies}
        loading={isLoading}
        rowKey="id"
      />

      <Modal
        title="Pharmacy Details"
        open={!!selectedPharmacyId}
        onCancel={() => setSelectedPharmacyId(null)}
        width={1000}
        footer={null}
      >
        {selectedPharmacyId && <PharmacyDetails pharmacyId={selectedPharmacyId} />}
      </Modal>
    </div>
  );
};

export default Pharmacies;