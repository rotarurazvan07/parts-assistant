import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';
import TextArea from '../ui/TextArea';
import Tabs from '../ui/Tabs';

// Validation schema for part form
const partSchema = yup.object({
  name: yup.string().required('Part name is required'),
  part_number: yup.string().optional(),
  manufacturer: yup.string().optional(),
  category_id: yup.number().nullable().optional(),
  bin_id: yup.number().nullable().optional(),
  quantity: yup.number().nullable().optional(),
  description: yup.string().optional(),
  tags: yup.string().optional(),
  datasheet_url: yup.string().url('Please enter a valid URL').optional(),
  image_url: yup.string().url('Please enter a valid URL').optional(),
  supplier: yup.string().optional(),
  supplier_part_number: yup.string().optional(),
  location: yup.string().optional(),
  notes: yup.string().optional()
}).required();

const PartModal = ({ isOpen, onClose, part, categories, bins, onSave, onDelete }) => {
  // State for active tab
  const [activeTab, setActiveTab] = useState(0);
  
  // State for specifications
  const [specifications, setSpecifications] = useState(part?.specifications || []);
  const [newSpecification, setNewSpecification] = useState({ name: '', value: '' });
  
  // State for documents
  const [documents, setDocuments] = useState(part?.documents || []);
  const [newDocument, setNewDocument] = useState({ name: '', url: '' });
  
  // State for tags
  const [tags, setTags] = useState(part?.tags ? part.tags.split(',').map(tag => tag.trim()) : []);
  const [newTag, setNewTag] = useState('');
  
  // Initialize form with react-hook-form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    resolver: yupResolver(partSchema),
    defaultValues: {
      name: part?.name || '',
      part_number: part?.part_number || '',
      manufacturer: part?.manufacturer || '',
      category_id: part?.category_id || '',
      bin_id: part?.bin_id || '',
      quantity: part?.quantity || '',
      description: part?.description || '',
      tags: part?.tags || '',
      datasheet_url: part?.datasheet_url || '',
      image_url: part?.image_url || '',
      supplier: part?.supplier || '',
      supplier_part_number: part?.supplier_part_number || '',
      location: part?.location || '',
      notes: part?.notes || ''
    }
  });
  
  // Handle form submission
  const onSubmit = (data) => {
    // Prepare data to save
    const dataToSave = {
      ...data,
      tags: tags.join(', '),
      specifications: specifications,
      documents: documents
    };
    
    onSave(dataToSave);
  };
  
  // Handle delete
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      onDelete(part.id);
      onClose();
    }
  };
  
  // Handle specifications changes
  const handleAddSpecification = () => {
    if (newSpecification.name && newSpecification.value) {
      setSpecifications(prev => [...prev, newSpecification]);
      setNewSpecification({ name: '', value: '' });
    }
  };
  
  const handleRemoveSpecification = (index) => {
    setSpecifications(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle documents changes
  const handleAddDocument = () => {
    if (newDocument.name && newDocument.url) {
      setDocuments(prev => [...prev, newDocument]);
      setNewDocument({ name: '', url: '' });
    }
  };
  
  const handleRemoveDocument = (index) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle tags changes
  const handleAddTag = () => {
    if (newTag.trim()) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (index) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };
  
  // Prepare category options
  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }));
  
  // Prepare bin options
  const binOptions = bins.map(bin => ({
    value: bin.id,
    label: bin.name
  }));
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab}>
          <Tabs.Tab label="Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Part Name"
                error={errors.name?.message}
                {...register('name')}
              />
              <InputField
                label="Part Number"
                error={errors.part_number?.message}
                {...register('part_number')}
              />
              <InputField
                label="Manufacturer"
                error={errors.manufacturer?.message}
                {...register('manufacturer')}
              />
              <SelectField
                label="Category"
                error={errors.category_id?.message}
                options={categoryOptions}
                {...register('category_id')}
              />
              <SelectField
                label="Bin"
                error={errors.bin_id?.message}
                options={binOptions}
                {...register('bin_id')}
              />
              <InputField
                label="Quantity"
                type="number"
                error={errors.quantity?.message}
                {...register('quantity')}
              />
              <InputField
                label="Supplier"
                error={errors.supplier?.message}
                {...register('supplier')}
              />
              <InputField
                label="Supplier Part Number"
                error={errors.supplier_part_number?.message}
                {...register('supplier_part_number')}
              />
              <InputField
                label="Location"
                error={errors.location?.message}
                {...register('location')}
              />
              <InputField
                label="Datasheet URL"
                error={errors.datasheet_url?.message}
                {...register('datasheet_url')}
              />
              <InputField
                label="Image URL"
                error={errors.image_url?.message}
                {...register('image_url')}
              />
              <TextArea
                label="Description"
                error={errors.description?.message}
                {...register('description')}
                rows={3}
              />
              <TextArea
                label="Notes"
                error={errors.notes?.message}
                {...register('notes')}
                rows={3}
              />
            </div>
          </Tabs.Tab>
          <Tabs.Tab label="Specifications">
            <div className="space-y-4">
              <h3 className="text-lg font-heading font-bold mb-4">Specifications</h3>
              
              {/* Add new specification form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <InputField
                  label="Name"
                  value={newSpecification.name}
                  onChange={(e) => setNewSpecification(prev => ({ ...prev, name: e.target.value }))}
                />
                <InputField
                  label="Value"
                  value={newSpecification.value}
                  onChange={(e) => setNewSpecification(prev => ({ ...prev, value: e.target.value }))}
                />
                <Button 
                  type="button" 
                  onClick={handleAddSpecification}
                  className="self-end"
                >
                  Add
                </Button>
              </div>
              
              {/* Specifications list */}
              <div className="space-y-2">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border border-border rounded">
                    <div>
                      <span className="font-medium">{spec.name}:</span> {spec.value}
                    </div>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleRemoveSpecification(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Tabs.Tab>
          <Tabs.Tab label="Documents">
            <div className="space-y-4">
              <h3 className="text-lg font-heading font-bold mb-4">Documents</h3>
              
              {/* Add new document form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <InputField
                  label="Name"
                  value={newDocument.name}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, name: e.target.value }))}
                />
                <InputField
                  label="URL"
                  value={newDocument.url}
                  onChange={(e) => setNewDocument(prev => ({ ...prev, url: e.target.value }))}
                />
                <Button 
                  type="button" 
                  onClick={handleAddDocument}
                  className="self-end"
                >
                  Add
                </Button>
              </div>
              
              {/* Documents list */}
              <div className="space-y-2">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border border-border rounded">
                    <div>
                      <span className="font-medium">{doc.name}:</span> {doc.url}
                    </div>
                    <Button 
                      type="button" 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleRemoveDocument(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </Tabs.Tab>
        </Tabs>
        
        <div className="flex justify-between mt-6">
          {part && (
            <Button type="button" variant="secondary" onClick={handleDelete}>
              Delete Part
            </Button>
          )}
          <div className="flex space-x-2 ml-auto">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {part ? 'Update Part' : 'Create Part'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default PartModal;