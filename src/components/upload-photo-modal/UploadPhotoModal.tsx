import React, { useState } from 'react';
import Modal  from '../Modal';
import './uploadPhotoModal.css'

interface UploadPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
  isSubmitting: boolean;
  memberName: string;
}

const UploadPhotoModal: React.FC<UploadPhotoModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting, memberName }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onSubmit(selectedFile);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Upload de Foto para ${memberName}`}>
      <div className="text-center mb-3">
        {preview ? (
          <img src={preview} alt="Pré-visualização" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }} />
        ) : (
          <div style={{ width: '150px', height: '150px', border: '2px dashed #ccc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto' }}>
            <span>Foto 3x4</span>
          </div>
        )}
      </div>
      <div className="mb-3">
        <label htmlFor="photoUpload" className="form-label">Selecione um arquivo de imagem</label>
        <input className="form-control" type="file" id="photoUpload" accept="image/png, image/jpeg" onChange={handleFileChange} />
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancelar</button>
        <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={!selectedFile || isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar Foto'}
        </button>
      </div>
    </Modal>
  );
};

export default UploadPhotoModal;