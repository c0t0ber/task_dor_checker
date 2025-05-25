import { Link, useParams } from 'react-router-dom';
import { PencilIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useDor } from '../hooks/useDors';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const DorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { dor, loading, error } = useDor(id ? parseInt(id) : undefined);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Link
          to="/dors"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Назад к списку DoR
        </Link>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!dor) {
    return (
      <div className="space-y-6">
        <Link
          to="/dors"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Назад к списку DoR
        </Link>
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">DoR не найден</h3>
          <p className="mt-1 text-sm text-gray-500">
            Запрашиваемый DoR не существует или был удален.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/dors"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Назад к списку DoR
        </Link>
        <Link
          to={`/dors/${dor.id}/edit`}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PencilIcon className="h-4 w-4 mr-2" />
          Редактировать
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-gray-900">{dor.name}</h1>
          <div className="mt-1 max-w-2xl text-sm text-gray-500">
            <p>{dor.description || 'Без описания'}</p>
          </div>
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
            <span>Создан: {formatDate(dor.created_at)}</span>
            <span>•</span>
            <span>Обновлен: {formatDate(dor.updated_at)}</span>
            <span>•</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {dor.criteria.length} критериев
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Критерии проверки</h3>
            {dor.criteria.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">Критерии не заданы</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dor.criteria
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((criterion, index) => (
                    <div
                      key={criterion.id}
                      className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{criterion.criterion}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Как использовать этот DoR</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Перейдите на страницу <Link to="/" className="font-medium underline">проверки задач</Link> и выберите этот DoR для анализа текста задачи на соответствие указанным критериям.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DorDetail; 