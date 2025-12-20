import { useEffect, useState } from 'react';
import AdminTable from '../components/AdminTable';
import AxiosClient from '../AxiosClient';
import { useUserContext } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';

function RentalRequestsManagement() {
  const { t, translateStatus } = useLanguage();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setMessage } = useUserContext();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    setLoading(true);
    AxiosClient.get('/admin/rental-requests')
      .then((response) => {
        setRequests(response.data.data || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching rental requests:', error);
        setLoading(false);
      });
  };

  const handleStatusUpdate = (request, newStatus) => {
    AxiosClient.patch(`/admin/rental-requests/${request.id}/status`, { status: newStatus })
      .then(() => {
        setMessage(
          t('admin.rentalRequests') +
            ' ' +
            translateStatus(newStatus) +
            ' ' +
            t('common.success')
        );
        fetchRequests();
      })
      .catch((error) => {
        console.error('Error updating rental request status:', error);
        setMessage(t('admin.errorUpdatingRequest'), 'error');
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
      key: 'requested_at',
      label: t('admin.requestDate'),
      render: (value) => (value ? new Date(value).toLocaleDateString() : 'N/A'),
    },
    {
      key: 'status',
      label: t('admin.status'),
      render: (value) => {
        const statusColors = {
          pending: 'bg-yellow-200',
          approved: 'bg-green-200',
          rejected: 'bg-red-200',
        };
        return (
          <span className={`px-2 py-1 rounded-md text-sm ${statusColors[value] || 'bg-gray-200'}`}>
            {translateStatus(value)}
          </span>
        );
      },
    },
  ];

  const actions = (request) => {
    if (request.status === 'pending') {
      return [
        {
          label: t('admin.approve'),
          onClick: () => handleStatusUpdate(request, 'approved'),
          variant: 'success',
        },
        {
          label: t('admin.reject'),
          onClick: () => handleStatusUpdate(request, 'rejected'),
          variant: 'danger',
        },
      ];
    }
    return [];
  };

  return (
    <div className="px-5 mx-auto max-w-[1366px]">
      <h1 className="text-3xl font-bold text-[#444] mb-8">{t('admin.rentalRequests')}</h1>
      <AdminTable columns={columns} data={requests} actions={actions} loading={loading} />
    </div>
  );
}

export default RentalRequestsManagement;

