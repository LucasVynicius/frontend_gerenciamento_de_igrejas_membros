import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { MinisterRequestDTO } from '../../services/minister/ministerService';
import type { Member } from '../../types/member/Member';
import type { Church } from '../../types/church/Church';
import { MinisterialPosition } from '../../enums/MinisterialPosition';
import { translatePosition } from '../../utils/translations';
import './MinisterForm.css';

type MinisterFormInitialData = {
  idMember?: number;
  idChurch?: number;
  position?: MinisterialPosition;
  consecrationDate?: string;
};

interface MinisterFormProps {
  initialData?: MinisterFormInitialData | null;
  onSubmit: (data: MinisterRequestDTO) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  members: Member[]; 
  churches: Church[]; 
}

const MinisterForm: React.FC<MinisterFormProps> = ({ initialData , onSubmit, onCancel, isSubmitting, members, churches, }) => {

  const { handleSubmit, formState: { errors }, register, reset } = useForm<MinisterRequestDTO>();

  useEffect(() => {
    if (initialData) {
      reset({
        idMember: initialData.idMember,
        idChurch: initialData.idChurch,
        position: initialData.position,
        consecrationDate: initialData.consecrationDate ? new Date(initialData.consecrationDate).toISOString().split('T')[0] : undefined,
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit: SubmitHandler<MinisterRequestDTO> = (data) => {
    const finalData = {
      ...data,
      idMember: Number(data.idMember),
      idChurch: Number(data.idChurch),
    };
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div className="mb-3">
        <label htmlFor="idMember" className="form-label">Selecione o Membro</label>
        <select
          id="idMember"
          {...register('idMember', { required: 'É necessário selecionar um membro' })}
          className={`form-select ${errors.idMember ? 'is-invalid' : ''}`}
          disabled={!!initialData?.idMember}
        >
          <option value="">Selecione...</option>
          {members.map(member => (
            <option key={member.id} value={member.id}>{member.fullName}</option>
          ))}
        </select>
        {errors.idMember && <div className="invalid-feedback">{errors.idMember.message}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="idChurch" className="form-label">Selecione a Igreja</label>
        <select
          id="idChurch"
          {...register('idChurch', { required: 'É necessário selecionar uma igreja' })}
          className={`form-select ${errors.idChurch ? 'is-invalid' : ''}`}
        >
          <option value="">Selecione...</option>
          {churches.map(church => (
            <option key={church.id} value={church.id}>
              {`${church.name} (${church.tradeName})`}
            </option>
          ))}
        </select>
        {errors.idChurch && <div className="invalid-feedback">{errors.idChurch.message}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="position" className="form-label">Selecione o Cargo</label>
        <select
          id="position"
          {...register('position', { required: 'É necessário selecionar um cargo' })}
          className={`form-select ${errors.position ? 'is-invalid' : ''}`}
        >
          <option value="">Selecione...</option>
          {Object.values(MinisterialPosition).map(pos => (
            <option key={pos} value={pos}>{translatePosition(pos)}</option>
          ))}
        </select>
        {errors.position && <div className="invalid-feedback">{errors.position.message}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="consecrationDate" className="form-label">Data da Consagração</label>
        <input
          type="date"
          id="consecrationDate"
          {...register('consecrationDate', { required: 'A data é obrigatória' })}
          className={`form-control ${errors.consecrationDate ? 'is-invalid' : ''}`}
        />
      </div>

      <div className="modal-footer mt-4">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};

export default MinisterForm;