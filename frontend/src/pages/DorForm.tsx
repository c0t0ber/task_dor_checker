import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useDor, useDors } from '../hooks/useDors';
import { CreateDorRequest, UpdateDorRequest } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

interface DorFormData {
  name: string;
  description: string;
  criteria: { value: string }[];
}

const DorForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const { dor, loading: dorLoading, error: dorError } = useDor(id ? parseInt(id) : undefined);
  const { createDor } = useDors();
  const { updateDor } = useDor();
  
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DorFormData>({
    defaultValues: {
      name: '',
      description: '',
      criteria: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'criteria',
  });

  // Reset form when dor data loads
  useEffect(() => {
    if (isEditing && dor) {
      reset({
        name: dor.name,
        description: dor.description,
        criteria: dor.criteria.map(criterion => ({ value: criterion.criterion })),
      });
    }
  }, [dor, isEditing, reset]);

  const onSubmit = async (data: DorFormData) => {
    try {
      setSaving(true);
      setSaveError(null);

      const formData = {
        name: data.name,
        description: data.description,
        criteria: data.criteria.map(c => c.value).filter(c => c.trim() !== ''),
      };

      let success = false;

      if (isEditing && id) {
        success = await updateDor(parseInt(id), formData as UpdateDorRequest);
      } else {
        success = await createDor(formData as CreateDorRequest);
      }

      if (success) {
        navigate('/dors');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Произошла ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  const addCriterion = () => {
    append({ value: '' });
  };

  const removeCriterion = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  if (isEditing && dorLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Редактировать DoR' : 'Создать новый DoR'}
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          {isEditing 
            ? 'Внесите изменения в существующий шаблон DoR'
            : 'Создайте новый шаблон Definition of Ready с критериями проверки'
          }
        </p>
      </div>

      {dorError && (
        <ErrorMessage message={dorError} />
      )}

      {saveError && (
        <ErrorMessage
          message={saveError}
          onDismiss={() => setSaveError(null)}
        />
      )}

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Название DoR *
              </label>
              <input
                type="text"
                {...register('name', {
                  required: 'Название обязательно',
                  minLength: { value: 1, message: 'Минимум 1 символ' },
                  maxLength: { value: 200, message: 'Максимум 200 символов' },
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Например: Backend Task DoR"
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Описание
              </label>
              <textarea
                {...register('description', {
                  maxLength: { value: 1000, message: 'Максимум 1000 символов' },
                })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Краткое описание назначения этого DoR"
              />
              {errors.description && (
                <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Критерии проверки *
                </label>
                <button
                  type="button"
                  onClick={addCriterion}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="h-3 w-3 mr-1" />
                  Добавить критерий
                </button>
              </div>
              
              <div className="mt-3 space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-start space-x-3">
                    <div className="flex-1">
                      <textarea
                        {...register(`criteria.${index}.value`, {
                          required: 'Критерий не может быть пустым',
                          minLength: { value: 1, message: 'Минимум 1 символ' },
                          maxLength: { value: 500, message: 'Максимум 500 символов' },
                        })}
                        rows={2}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder={`Критерий ${index + 1}`}
                      />
                      {errors.criteria?.[index]?.value && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.criteria[index]?.value?.message}
                        </p>
                      )}
                    </div>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCriterion(index)}
                        className="mt-1 inline-flex items-center p-1 border border-transparent rounded-md text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <p className="mt-2 text-sm text-gray-500">
                Добавьте критерии, по которым будет проверяться готовность задачи
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/dors')}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Сохранение...
                  </>
                ) : (
                  isEditing ? 'Сохранить изменения' : 'Создать DoR'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DorForm;