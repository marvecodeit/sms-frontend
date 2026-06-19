import { useState } from 'react';
import { toast } from 'react-toastify';
import { resultsAPI } from '../api/results.api';
import { PageHeader, Button, Card, LoadingSpinner, EmptyState } from '../components/common/UIComponents';
import { useAPI } from '../hooks/useAPI';

export const ResultsUploadPage = () => {
  const [file, setFile] = useState(null);
  const [classId, setClassId] = useState('');
  const [term, setTerm] = useState('');
  const [preview, setPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [classes, setClasses] = useState([]);

  const { loading: uploading, execute: upload } = useAPI(resultsAPI.uploadResults, {
    successMessage: 'Results uploaded successfully!',
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validate file
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!validTypes.includes(selectedFile.type)) {
      toast.error('Please upload a valid Excel file (.xls, .xlsx)', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    setFile(selectedFile);
    setPreview({
      name: selectedFile.name,
      size: (selectedFile.size / 1024).toFixed(2),
      type: selectedFile.type
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const event = { target: { files: [droppedFile] } };
      handleFileChange(event);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !classId || !term) {
      toast.error('Please select file, class, and term', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('classId', classId);
      formData.append('term', term);

      await upload(formData);

      // Reset form
      setFile(null);
      setPreview(null);
      setClassId('');
      setTerm('');
      setUploadProgress(0);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="sms-container">
      <PageHeader 
        title="Upload Results" 
        subtitle="Upload Excel file with student results"
      />

      <div className="sms-grid" style={{ gridTemplateColumns: '1fr' }}>
        <Card>
          <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
            {/* File Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                border: '2px dashed #0284c7',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                backgroundColor: 'rgba(2, 132, 199, 0.05)',
                cursor: 'pointer',
                marginBottom: '1.5rem'
              }}
            >
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                disabled={uploading}
                style={{ display: 'none' }}
                id="file-input"
              />
              <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📁</div>
                <div style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                  Drag and drop Excel file here
                </div>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                  or click to select file (.xlsx, .xls)
                </div>
              </label>
            </div>

            {/* File Preview */}
            {preview && (
              <div style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #0284c7',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
                  Selected File:
                </div>
                <div style={{ fontWeight: 500, marginBottom: '0.5rem' }}>{preview.name}</div>
                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                  Size: {preview.size} KB
                </div>
              </div>
            )}

            {/* Class Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Select Class *
              </label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                disabled={uploading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  fontSize: '1rem'
                }}
              >
                <option value="">Choose a class...</option>
                <option value="class-1">Class 1A</option>
                <option value="class-2">Class 2B</option>
                <option value="class-3">Class 3C</option>
              </select>
            </div>

            {/* Term Selection */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Select Term *
              </label>
              <select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                disabled={uploading}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontFamily: 'inherit',
                  fontSize: '1rem'
                }}
              >
                <option value="">Choose a term...</option>
                <option value="term1">First Term</option>
                <option value="term2">Second Term</option>
                <option value="term3">Third Term</option>
              </select>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Uploading: {uploadProgress}%
                </div>
                <div style={{
                  backgroundColor: '#e0e0e0',
                  borderRadius: '4px',
                  height: '8px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    backgroundColor: '#0284c7',
                    height: '100%',
                    width: `${uploadProgress}%`,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              disabled={!file || !classId || !term || uploading}
              style={{
                width: '100%',
                opacity: !file || !classId || !term || uploading ? 0.6 : 1,
              }}
            >
              {uploading ? (
                <>
                  <LoadingSpinner size="sm" /> Uploading...
                </>
              ) : (
                'Upload Results'
              )}
            </Button>
          </form>
        </Card>

        {/* Instructions Card */}
        <Card style={{ marginTop: '1.5rem' }}>
          <div style={{ padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
              📋 Excel File Format
            </h3>
            <ul style={{ fontSize: '0.875rem', lineHeight: 1.8, color: '#666' }}>
              <li>Column A: Student Registration Number</li>
              <li>Column B: Subject 1 Score</li>
              <li>Column C: Subject 2 Score</li>
              <li>Column D: Subject 3 Score</li>
              <li style={{ marginTop: '0.5rem', fontWeight: 500 }}>Scores should be 0-100</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResultsUploadPage;
