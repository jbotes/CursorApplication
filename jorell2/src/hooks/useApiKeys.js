import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createApiKey = async (name, monthlyLimit) => {
    try {
      const newKey = {
        name: name.trim(),
        key: `key_${Math.random().toString(36).substr(2, 9)}`,
        monthly_limit: monthlyLimit,
        current_usage: 0
      };

      const { data, error } = await supabase
        .from('api_keys')
        .insert([newKey])
        .select()
        .single();

      if (error) throw error;

      setApiKeys([data, ...apiKeys]);
      return { success: true, data };
    } catch (error) {
      console.error('Error creating API key:', error);
      return { success: false, error: error.message };
    }
  };

  const updateApiKey = async (id, name) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ name: name.trim() })
        .eq('id', id);

      if (error) throw error;

      setApiKeys(apiKeys.map(key => 
        key.id === id ? { ...key, name: name.trim() } : key
      ));
      return { success: true };
    } catch (error) {
      console.error('Error updating API key:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteApiKey = async (id) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setApiKeys(apiKeys.filter(key => key.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting API key:', error);
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  return {
    apiKeys,
    isLoading,
    error,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    refreshApiKeys: fetchApiKeys
  };
}; 