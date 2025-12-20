import { useEffect, useState } from 'react';
import AdminTable from '../components/AdminTable';
import AxiosClient from '../AxiosClient';
import { useUserContext } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';

function ContractManagement() {
  const { t, translateStatus } = useLanguage();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setMessage } = useUserContext();

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = () => {
    setLoading(true);
    AxiosClient.get('/admin/contracts')
      .then((response) => {
        setContracts(response.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching contracts:', error);
        setLoading(false);
      });
  };

  const handleStatusUpdate = (contract, newStatus) => {
    AxiosClient.patch(`/admin/contracts/${contract.id}/status`, { status: newStatus })
      .then(() => {
        setMessage(
          t('admin.contracts') +
            ' ' +
            t('admin.status') +
            ' ' +
            translateStatus(newStatus) +
            ' ' +
            t('common.success')
        );
        fetchContracts();
      })
      .catch((error) => {
        console.error('Error updating contract status:', error);
        setMessage(t('admin.errorUpdatingContract'), 'error');
      });
  };

  const columns = [
    {
      key: 'user',
      label: t('admin.tenant'),
      render: (value, row) => (row.user ? row.user.name : 'N/A'),
    },
    {
      key: 'post',
      label: t('admin.apartment'),
      render: (value, row) => (row.post ? row.post.Title : 'N/A'),
    },
    {
      key: 'start_date',
      label: t('admin.startDate'),
      render: (value) => (value ? new Date(value).toLocaleDateString() : 'N/A'),
    },
    {
      key: 'end_date',
      label: t('admin.endDate'),
      render: (value) => (value ? new Date(value).toLocaleDateString() : 'N/A'),
    },
    {
      key: 'status',
      label: t('admin.status'),
      render: (value) => {
        const statusColors = {
          active: 'bg-green-200',
          expired: 'bg-gray-200',
          cancelled: 'bg-red-200',
        };
        return (
          <span className={`px-2 py-1 rounded-md text-sm ${statusColors[value] || 'bg-gray-200'}`}>
            {translateStatus(value)}
          </span>
        );
      },
    },
  ];

  const actions = (contract) => {
    const actionButtons = [];
    if (contract.status === 'active') {
      actionButtons.push({
        label: t('admin.disable'),
        onClick: () => handleStatusUpdate(contract, 'cancelled'),
        variant: 'danger',
      });
    }
    return actionButtons;
  };

  return (
    <div className="px-5 mx-auto max-w-[1366px]">
      <h1 className="text-3xl font-bold text-[#444] mb-8">{t('admin.contracts')}</h1>
      <AdminTable columns={columns} data={contracts} actions={actions} loading={loading} />
    </div>
  );
}

export default ContractManagement;

