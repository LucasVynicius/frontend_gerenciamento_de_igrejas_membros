// src/components/meetingForm/MeetingForm.tsx

import React, { useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { MeetingRequestDTO } from '../../services/meeting/meetingService';
import type { MinisterInfo } from '../../services/minister/ministerService'; // Importa a interface MinisterInfo
// import './MeetingForm.css';

// Interface para os dados iniciais do formulário (congração ou edição)
export interface MeetingFormInitialData {
    id?: number;
    date?: string;
    summary?: string;
    notes?: string;
    participantIds?: number[];
}


interface MeetingFormProps {
    initialData?: MeetingFormInitialData | null;
    onSubmit: (data: MeetingRequestDTO) => void;
    onCancel: () => void;
    isSubmitting: boolean;
    ministers: MinisterInfo[];

}

const MeetingForm: React.FC<MeetingFormProps> = ({ 
    initialData, 
    onSubmit, 
    onCancel, 
    isSubmitting, 
    ministers, // Recebe a lista de ministros
}) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<MeetingRequestDTO>();

    useEffect(() => {
        if (initialData) {
            reset({
                date: initialData.date || '',
                summary: initialData.summary || '',
                notes: initialData.notes || '',
                participantIds: initialData.participantIds,
            });
        }
    }, [initialData, reset]);

    const handleFormSubmit: SubmitHandler<MeetingRequestDTO> = (data) => {
        const finalData: MeetingRequestDTO = {
            ...data,
            participantIds: data.participantIds?.map(Number),
        };
        onSubmit(finalData);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
            {/* O JSX do formulário */}
            <div className="mb-3">
                <label htmlFor="date" className="form-label">Data da Reunião</label>
                <input
                    type="date"
                    id="date"
                    {...register('date', { required: 'A data é obrigatória' })}
                    className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                />
                {errors.date && <div className="invalid-feedback">{errors.date.message}</div>}
            </div>

            <div className="mb-3">
                <label htmlFor="summary" className="form-label">Resumo da Reunião</label>
                <input
                    type="text"
                    id="summary"
                    {...register('summary', { required: 'O resumo é obrigatório' })}
                    className={`form-control ${errors.summary ? 'is-invalid' : ''}`}
                />
                {errors.summary && <div className="invalid-feedback">{errors.summary.message}</div>}
            </div>

            <div className="mb-3">
                <label htmlFor="notes" className="form-label">Notas da Reunião</label>
                <textarea
                    id="notes"
                    {...register('notes')}
                    className="form-control"
                    rows={5}
                ></textarea>
            </div>

            <div className="mb-3">
                <label htmlFor="participants" className="form-label">Ministros Participantes</label>
                <select
                    id="participants"
                    multiple
                    {...register('participantIds')}
                    className="form-select"
                >
                    {ministers.map(minister => (
                        <option key={minister.id} value={minister.id}>
                            {minister.fullName}
                        </option>
                    ))}
                </select>
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

export default MeetingForm;