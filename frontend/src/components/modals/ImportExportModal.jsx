import React, { useState, useRef, useCallback } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Tabs from '../ui/Tabs';
import ImportExportService from '../../services/importExportService';

const ImportExportModal = ({ isOpen, onClose, onImport, onExport }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [importFile, setImportFile] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');
  const [dragActive, setDragActive] = useState(false);
  const [importError, setImportError] = useState(null);
  const [exportError, setExportError] = useState(null);
  const fileInputRef = useRef(null);

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle file drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const validTypes = ['text/csv', 'application/json'];
      const validExtensions = ['.csv', '.json'];
      
      const isValidType = validTypes.includes(file.type) ||
        validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (isValidType) {
        handleFileProcess(file);
      } else {
        setImportError('Please upload a CSV or JSON file');
      }
    }
  }, []);

  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileProcess(file);
    }
  };

  // Process the selected file
  const handleFileProcess = async (file) => {
    setImportFile(file);
    setImportError(null);
    await handleImport(file);
  };

  // Handle import from backend
  const handleImport = async (file) => {
    setIsImporting(true);
    setImportError(null);
    
    try {
      const result = await ImportExportService.importParts(file);
      setImportResult({
        success: true,
        fileName: file.name,
        message: result.message || 'Import completed successfully',
        partsImported: result.details?.imported || 0,
        errors: result.details?.errors || 0
      });
    } catch (error) {
      setImportError(error.message);
      setImportResult({
        success: false,
        fileName: file.name,
        message: error.message,
        partsImported: 0,
        errors: 0
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Handle export from backend
  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);
    
    try {
      const data = await ImportExportService.exportParts(exportFormat);
      // Download the file
      ImportExportService.downloadExport(data, exportFormat, 'parts-export');
      
      if (onExport) {
        onExport();
      }
    } catch (error) {
      setExportError(error.message);
    } finally {
      setIsExporting(false);
    }
  };

  // Handle drag and drop zone click
  const handleDragZoneClick = () => {
    fileInputRef.current.click();
  };

  // Reset state when modal closes
  const handleClose = () => {
    setImportFile(null);
    setImportResult(null);
    setImportError(null);
    setExportError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import/Export" size="lg">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab}>
        <Tabs.Tab label="Import">
          <div className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
                dragActive ? 'border-primary bg-hover' : 'border-border'
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={handleDragZoneClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <div className="flex flex-col items-center justify-center">
                <div className="text-2xl mb-2">📁</div>
                <p className="text-lg font-medium mb-1">Drag & Drop CSV or JSON File</p>
                <p className="text-text-muted mb-4">or click to browse files</p>
                <Button type="button" variant="secondary">
                  Browse Files
                </Button>
              </div>
            </div>
            
            {isImporting && (
              <div className="mt-4 p-4 border border-border rounded bg-panel">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary mr-3"></div>
                  <p>Processing import...</p>
                </div>
              </div>
            )}
            
            {importError && (
              <div className="mt-4 p-4 border border-destructive rounded bg-panel">
                <div className="flex items-center">
                  <span className="text-destructive mr-2">✗</span>
                  <p className="text-destructive">{importError}</p>
                </div>
              </div>
            )}
            
            {importResult && importResult.success && (
              <div className="mt-4 p-4 border border-success rounded bg-panel">
                <h3 className="font-heading font-bold mb-2 text-success">Import Successful</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>File:</div>
                  <div className="font-medium">{importResult.fileName}</div>
                  
                  <div>Message:</div>
                  <div className="font-medium">{importResult.message}</div>
                  
                  {importResult.partsImported > 0 && (
                    <>
                      <div>Parts Imported:</div>
                      <div className="font-medium text-success">{importResult.partsImported}</div>
                    </>
                  )}
                  
                  {importResult.errors > 0 && (
                    <>
                      <div>Errors:</div>
                      <div className="font-medium text-destructive">{importResult.errors}</div>
                    </>
                  )}
                </div>
              </div>
            )}
            
            <div className="mt-4 p-4 border border-border rounded bg-panel">
              <h3 className="font-heading font-bold mb-2">Supported Formats</h3>
              <p className="text-sm text-text-muted mb-2">
                You can import data from CSV or JSON files:
              </p>
              <ul className="text-sm text-text-muted list-disc pl-5">
                <li>CSV files with headers (recommended for bulk imports)</li>
                <li>JSON files with array of part objects</li>
                <li>Categories and bins will be created automatically if they don't exist</li>
                <li>All text fields are sanitized during import</li>
              </ul>
            </div>
          </div>
        </Tabs.Tab>
        <Tabs.Tab label="Export">
          <div className="space-y-4">
            <div className="p-4 border border-border rounded bg-panel">
              <h3 className="font-heading font-bold mb-2">Export Options</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span>Include part details</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span>Include categories</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span>Include bins</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Include specifications</span>
                </label>
              </div>
            </div>
            
            <div className="p-4 border border-border rounded bg-panel">
              <h3 className="font-heading font-bold mb-2">Export Format</h3>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="csv"
                    checked={exportFormat === 'csv'}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="mr-2"
                  />
                  <span>CSV</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="exportFormat"
                    value="json"
                    checked={exportFormat === 'json'}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="mr-2"
                  />
                  <span>JSON</span>
                </label>
              </div>
            </div>
            
            {exportError && (
              <div className="p-4 border border-destructive rounded bg-panel">
                <div className="flex items-center">
                  <span className="text-destructive mr-2">✗</span>
                  <p className="text-destructive">{exportError}</p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center"
              >
                {isExporting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-background mr-2"></div>
                )}
                Export Data
              </Button>
            </div>
          </div>
        </Tabs.Tab>
      </Tabs>
    </Modal>
  );
};

export default ImportExportModal;