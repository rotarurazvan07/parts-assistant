import React, { useState, useMemo } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../hooks';
import Button from '../ui/Button';
import Icon from '../ui/Icon';

// Build tree structure from flat list
const buildCategoryTree = (categories) => {
  if (!categories) return [];
  
  const categoryMap = {};
  const roots = [];
  
  // First pass: create map
  categories.forEach(category => {
    categoryMap[category.id] = { ...category, subcategories: [] };
  });
  
  // Second pass: build tree
  categories.forEach(category => {
    if (category.parent_id && categoryMap[category.parent_id]) {
      categoryMap[category.parent_id].subcategories.push(categoryMap[category.id]);
    } else {
      roots.push(categoryMap[category.id]);
    }
  });
  
  return roots;
};

const CategoryNode = ({ category, level = 0, onToggle, expandedCategories, onEdit, onDelete, editingCategory, editForm, setEditForm, handleSaveEditedCategory, handleDeleteCategory }) => {
  const isExpanded = expandedCategories[category.id];
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;
  const isEditing = editingCategory === category.id;

  return (
    <div className="select-none">
      {/* Category Row */}
      <div
        className={`flex items-center justify-between py-1.5 px-2 hover:bg-border rounded cursor-pointer group ${level > 0 ? 'ml-4' : ''}`}
        onClick={() => hasSubcategories && onToggle(category.id)}
      >
        <div className="flex items-center flex-1 min-w-0">
          {/* Expand/Collapse Icon */}
          {hasSubcategories ? (
            <Icon
              name={isExpanded ? "chevron-down" : "chevron-right"}
              size="xs"
              className="mr-1.5 flex-shrink-0"
            />
          ) : (
            <span className="w-3 mr-1.5" />
          )}
          
          {/* Category Name */}
          <span className="font-medium truncate text-sm">{category.name}</span>
        </div>
        
        {/* Action Buttons - Show on hover */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="text-xs text-text-primary hover:text-primary p-0.5"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(category);
            }}
            title="Edit"
          >
            <Icon name="edit" size="xs" />
          </button>
          <button
            className="text-xs text-destructive hover:text-destructive p-0.5"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCategory(category.id);
            }}
            title="Delete"
          >
            <Icon name="delete" size="xs" />
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className={`${level > 0 ? 'ml-8' : 'ml-4'} mt-2 p-2 border border-border rounded bg-background`}>
          <div className="flex">
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Category name"
              className="input-field flex-1 mr-1 text-xs py-1"
              autoFocus
            />
            <Button onClick={handleSaveEditedCategory} size="xs" className="px-2 py-1">
              Save
            </Button>
            <Button
              onClick={() => setEditingCategory(null)}
              size="xs"
              variant="ghost"
              className="px-2 py-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Subcategories */}
      {isExpanded && hasSubcategories && (
        <div className="mt-1">
          {category.subcategories.map(subcat => (
            <CategoryNode
              key={subcat.id}
              category={subcat}
              level={level + 1}
              onToggle={onToggle}
              expandedCategories={expandedCategories}
              onEdit={onEdit}
              editingCategory={editingCategory}
              editForm={editForm}
              setEditForm={setEditForm}
              handleSaveEditedCategory={handleSaveEditedCategory}
              handleDeleteCategory={handleDeleteCategory}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryTree = ({ onAddCategory, showAddModal, onOpenAddModal, onCloseAddModal }) => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryParentId, setNewCategoryParentId] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editForm, setEditForm] = useState({ id: null, name: '' });

  // Fetch categories data with React Query
  const { data: categoriesData, isLoading, isError } = useCategories();
  const { mutate: createCategory } = useCreateCategory();
  const { mutate: updateCategory } = useUpdateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();

  // Build tree from flat data
  const categoryTree = useMemo(() => buildCategoryTree(categoriesData), [categoriesData]);

  // Toggle category expanded state
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  // Handle add category button
  const handleAddCategory = () => {
    if (onOpenAddModal) {
      onOpenAddModal();
    }
    if (onAddCategory) {
      onAddCategory();
    }
  };

  // Handle save new category
  const handleSaveNewCategory = () => {
    if (newCategoryName.trim()) {
      createCategory({
        name: newCategoryName.trim(),
        parent_id: newCategoryParentId
      });
      setNewCategoryName('');
      setNewCategoryParentId(null);
      if (onCloseAddModal) {
        onCloseAddModal();
      }
    }
  };

  // Handle edit category
  const handleEditCategory = (category) => {
    setEditForm({ id: category.id, name: category.name });
    setEditingCategory(category.id);
  };

  // Handle save edited category
  const handleSaveEditedCategory = () => {
    if (editForm.name.trim() && editingCategory) {
      updateCategory({
        id: editForm.id,
        data: { name: editForm.name }
      });
      setEditForm({ id: null, name: '' });
      setEditingCategory(null);
    }
  };

  // Handle delete category
  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(categoryId);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <div className="text-destructive text-center py-4">
          Error loading categories
        </div>
      </div>
    );
  }

  return (
    <div className="pb-2">
      <div className="space-y-1">
        {categoryTree && categoryTree.map(category => (
          <CategoryNode
            key={category.id}
            category={category}
            level={0}
            onToggle={toggleCategory}
            expandedCategories={expandedCategories}
            onEdit={handleEditCategory}
            editingCategory={editingCategory}
            editForm={editForm}
            setEditForm={setEditForm}
            handleSaveEditedCategory={handleSaveEditedCategory}
            handleDeleteCategory={handleDeleteCategory}
          />
        ))}
      </div>

      {/* Smart Add Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-panel border border-border rounded p-4 w-96 max-w-full">
            <h3 className="font-heading font-bold mb-4">Add New Category</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Category Type</label>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant={newCategoryParentId === null ? "primary" : "secondary"}
                  onClick={() => setNewCategoryParentId(null)}
                  className="flex-1"
                >
                  Main Category
                </Button>
                <Button
                  type="button"
                  variant={newCategoryParentId !== null ? "primary" : "secondary"}
                  onClick={() => setNewCategoryParentId('select')}
                  className="flex-1"
                >
                  Subcategory
                </Button>
              </div>
            </div>

            {newCategoryParentId === 'select' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Parent Category</label>
                <select
                  value={newCategoryParentId === 'select' ? '' : newCategoryParentId}
                  onChange={(e) => setNewCategoryParentId(e.target.value ? parseInt(e.target.value) : null)}
                  className="input-field w-full"
                >
                  <option value="">Choose a parent...</option>
                  {categoryTree && categoryTree.map(category => (
                    <CategoryOption key={category.id} category={category} level={0} />
                  ))}
                </select>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Category Name</label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Enter category name"
                className="input-field w-full"
                autoFocus
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  if (onCloseAddModal) {
                    onCloseAddModal();
                  }
                  setNewCategoryName('');
                  setNewCategoryParentId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveNewCategory}
                disabled={!newCategoryName.trim()}
              >
                Add Category
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for select dropdown
const CategoryOption = ({ category, level }) => {
  return (
    <React.Fragment>
      <option value={category.id} style={{ paddingLeft: `${level * 20}px` }}>
        {'─'.repeat(level)} {category.name}
      </option>
      {category.subcategories && category.subcategories.map(subcat => (
        <CategoryOption key={subcat.id} category={subcat} level={level + 1} />
      ))}
    </React.Fragment>
  );
};

export default CategoryTree;