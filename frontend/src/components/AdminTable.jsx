import { useLanguage } from '../contexts/LanguageContext';

function AdminTable({ columns, data, actions, loading }) {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-[#888]">{t('common.loading')}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-[#888]">{t('admin.noData')}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left font-semibold text-[#444]">
                {col.label}
              </th>
            ))}
            {actions && (
              <th className="px-4 py-3 text-left font-semibold text-[#444]">
                {t('admin.actions')}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id || index} className="border-b border-gray-200 hover:bg-gray-100">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-[#444]">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {actions(row).map((action, idx) => (
                      <button
                        key={idx}
                        onClick={action.onClick}
                        className={`px-3 py-1 rounded-md text-sm font-semibold transition duration-300 ease hover:scale-105 ${
                          action.variant === 'danger'
                            ? 'bg-red-500 text-white'
                            : action.variant === 'success'
                            ? 'bg-green-500 text-white'
                            : 'bg-yellow-300 text-[#444]'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;

