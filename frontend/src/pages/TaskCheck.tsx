import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useDors } from '../hooks/useDors';
import { taskApi } from '../services/api';
import { CheckTaskRequest, CheckTaskResponse } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

interface TaskCheckForm {
  dor_id: number;
  task_text: string;
}

const TaskCheck = () => {
  const { dors, loading: dorsLoading, error: dorsError } = useDors();
  const [checkResult, setCheckResult] = useState<CheckTaskResponse | null>(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskCheckForm>();

  const onSubmit = async (data: TaskCheckForm) => {
    try {
      setChecking(true);
      setCheckError(null);
      setCheckResult(null);

      const request: CheckTaskRequest = {
        dor_id: Number(data.dor_id),
        task_text: data.task_text,
      };

      const result = await taskApi.check(request);
      setCheckResult(result);
    } catch (err: any) {
      setCheckError(err.response?.data?.detail || 'Ошибка при проверке задачи');
    } finally {
      setChecking(false);
    }
  };

  const handleNewCheck = () => {
    setCheckResult(null);
    setCheckError(null);
    reset();
  };

  if (dorsLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">Проверка задачи</h1>
        <p className="mt-4 text-lg text-gray-600">
          Введите текст задачи и выберите DoR для проверки соответствия критериям
        </p>
      </div>

      {dorsError && (
        <ErrorMessage message={dorsError} className="mb-6" />
      )}

      {checkError && (
        <ErrorMessage
          message={checkError}
          onDismiss={() => setCheckError(null)}
          className="mb-6"
        />
      )}

      {!checkResult ? (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg sm:rounded-lg border border-gray-200">
            <div className="px-6 py-8 sm:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div>
                  <label htmlFor="dor_id" className="block text-base font-medium text-gray-700 mb-3">
                    Выберите DoR
                  </label>
                  <select
                    {...register('dor_id', { required: 'Выберите DoR' })}
                    className="mt-1 block w-full rounded-md bg-white text-gray-900 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4"
                  >
                    <option value="">Выберите DoR...</option>
                    {dors.map((dor) => (
                      <option key={dor.id} value={dor.id}>
                        {dor.name} ({dor.criteria_count} критериев)
                      </option>
                    ))}
                  </select>
                  {errors.dor_id && (
                    <p className="mt-2 text-sm text-red-600">{errors.dor_id.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="task_text" className="block text-base font-medium text-gray-700 mb-3">
                    Текст задачи
                  </label>
                  <textarea
                    {...register('task_text', {
                      required: 'Введите текст задачи',
                      minLength: { value: 10, message: 'Минимум 10 символов' },
                      maxLength: { value: 5000, message: 'Максимум 5000 символов' },
                    })}
                    rows={10}
                    className="mt-1 block w-full rounded-md bg-white text-gray-900 placeholder-gray-500 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base py-3 px-4 resize-y min-h-[200px]"
                    placeholder="Введите описание задачи..."
                  />
                  {errors.task_text && (
                    <p className="mt-2 text-sm text-red-600">{errors.task_text.message}</p>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={checking}
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checking ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Проверка...
                      </>
                    ) : (
                      'Проверить задачу'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Results Header */}
          <div className="bg-white shadow-lg sm:rounded-lg border border-gray-200">
            <div className="px-6 py-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Результаты проверки: {checkResult.dor_name}
                  </h3>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Пройдено: {checkResult.passed_criteria} из {checkResult.total_criteria}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        checkResult.pass_rate >= 80
                          ? 'bg-green-100 text-green-800'
                          : checkResult.pass_rate >= 60
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {checkResult.pass_rate}%
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleNewCheck}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Новая проверка
                </button>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="bg-white shadow-lg overflow-hidden sm:rounded-lg border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {checkResult.results.map((result, index) => (
                <li key={index} className="px-6 py-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {result.passed ? (
                        <CheckCircleIcon className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircleIcon className="h-6 w-6 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {result.criterion}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">{result.comment}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          result.passed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {result.passed ? 'Пройдено' : 'Не пройдено'}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCheck; 