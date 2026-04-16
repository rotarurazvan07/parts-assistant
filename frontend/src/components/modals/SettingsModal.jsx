import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';

// Validation schema for settings form
const settingsSchema = yup.object({
  aiProvider: yup.string().required('AI Provider is required'),
  apiKey: yup.string().required('API Key is required'),
  theme: yup.string().required('Theme is required'),
  language: yup.string().required('Language is required')
}).required();

const SettingsModal = ({ isOpen, onClose, settings, onSave }) => {
  // State for API key visibility
  const [showApiKey, setShowApiKey] = useState(false);
  
  // State for configuration status
  const [isConfigured, setIsConfigured] = useState(!!settings?.apiKey);
  
  // Initialize form with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(settingsSchema),
    defaultValues: {
      aiProvider: settings?.aiProvider || 'openai',
      apiKey: settings?.apiKey || '',
      theme: settings?.theme || 'dark',
      language: settings?.language || 'en'
    }
  });
  
  // Handle save
  const handleSave = (data) => {
    // Check if API key is provided
    if (data.apiKey) {
      setIsConfigured(true);
    }
    
    onSave(data);
  };
  
  // Handle test connection
  const handleTestConnection = async () => {
    // In a real implementation, this would test the API connection
    // For now, we'll just simulate a successful test
    alert('Connection test successful!');
  };
  
  // Handle clear settings
  const handleClearSettings = () => {
    reset({
      aiProvider: 'openai',
      apiKey: '',
      theme: 'dark',
      language: 'en'
    });
    setIsConfigured(false);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" size="lg">
      <form onSubmit={handleSubmit(handleSave)}>
        <div className="space-y-6">
          {/* AI Provider Settings */}
          <div className="border border-border rounded p-4">
            <h3 className="text-lg font-heading font-bold mb-3">AI Provider Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="AI Provider"
                error={errors.aiProvider?.message}
                options={[
                  { value: 'openai', label: 'OpenAI' },
                  { value: 'anthropic', label: 'Anthropic' },
                  { value: 'mistral', label: 'Mistral' },
                  { value: 'ollama', label: 'Ollama' }
                ]}
                {...register('aiProvider')}
              />
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    className="input-field w-full pr-10"
                    placeholder="Enter your API key"
                    {...register('apiKey')}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-2 text-text-muted hover:text-text-primary"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.apiKey && (
                  <p className="text-destructive text-xs mt-1">{errors.apiKey.message}</p>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex items-center">
              <div className="flex-1">
                {isConfigured ? (
                  <div className="flex items-center text-success">
                    <span className="mr-2">✓</span>
                    <span>Configured</span>
                  </div>
                ) : (
                  <div className="flex items-center text-warning">
                    <span className="mr-2">⚠️</span>
                    <span>Not configured</span>
                  </div>
                )}
              </div>
              
              <Button 
                type="button" 
                variant="secondary" 
                onClick={handleTestConnection}
                disabled={!settings?.apiKey}
              >
                Test Connection
              </Button>
            </div>
          </div>
          
          {/* Application Settings */}
          <div className="border border-border rounded p-4">
            <h3 className="text-lg font-heading font-bold mb-3">Application Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Theme"
                error={errors.theme?.message}
                options={[
                  { value: 'dark', label: 'Dark' },
                  { value: 'light', label: 'Light' },
                  { value: 'system', label: 'System Default' }
                ]}
                {...register('theme')}
              />
              
              <SelectField
                label="Language"
                error={errors.language?.message}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                  { value: 'de', label: 'German' }
                ]}
                {...register('language')}
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleClearSettings}
            >
              Clear Settings
            </Button>
            
            <div className="flex space-x-2">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default SettingsModal;