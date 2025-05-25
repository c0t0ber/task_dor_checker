import { useState, useEffect } from 'react';
import { dorApi } from '../services/api';
import {
  DorListResponse,
  DorDetailResponse,
  CreateDorRequest,
  UpdateDorRequest,
} from '../types';

export const useDors = () => {
  const [dors, setDors] = useState<DorListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDors = async () => {
    try {
      setLoading(true);
      setError(null);
      const dorsList = await dorApi.list();
      setDors(dorsList);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка при загрузке DoR');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDors();
  }, []);

  const createDor = async (data: CreateDorRequest) => {
    try {
      await dorApi.create(data);
      await fetchDors(); // Refresh list
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка при создании DoR');
      return false;
    }
  };

  const deleteDor = async (id: number) => {
    try {
      await dorApi.delete(id);
      await fetchDors(); // Refresh list
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка при удалении DoR');
      return false;
    }
  };

  return {
    dors,
    loading,
    error,
    fetchDors,
    createDor,
    deleteDor,
    setError,
  };
};

export const useDor = (id?: number) => {
  const [dor, setDor] = useState<DorDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDor = async (dorId: number) => {
    try {
      setLoading(true);
      setError(null);
      const dorData = await dorApi.getById(dorId);
      setDor(dorData);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка при загрузке DoR');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDor(id);
    }
  }, [id]);

  const updateDor = async (dorId: number, data: UpdateDorRequest) => {
    try {
      await dorApi.update(dorId, data);
      await fetchDor(dorId); // Refresh data
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Ошибка при обновлении DoR');
      return false;
    }
  };

  return {
    dor,
    loading,
    error,
    fetchDor,
    updateDor,
    setError,
  };
}; 