import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { IMaskInput } from 'react-imask'; 
import { getChurches } from '../../services/church/ChurchService';
import type { Church } from '../../types/church/Church';
import type { MemberRequestDTO } from '../../dtos/MemberRequestDTO';

interface MemberFormProps {
    initialData?: Partial<MemberRequestDTO>;
    onSubmit: (data: MemberRequestDTO) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

const MemberForm: React.FC<MemberFormProps> = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
    const [churches, setChurches] = useState<Church[]>([]);
    const { control, handleSubmit, formState: { errors }, register } = useForm<MemberRequestDTO>({
        defaultValues: initialData || { active: true },
    });

    useEffect(() => {
        const fetchChurches = async () => {
            try {
                const churchData = await getChurches();
                setChurches(churchData);
            } catch (error) {
                console.error("Falha ao buscar igrejas para o formulário:", error);
            }
        };
        fetchChurches();
    }, []);

    const handleFormSubmit: SubmitHandler<MemberRequestDTO> = (data) => {
        const finalData = {
            ...data,
            idChurch: Number(data.idChurch),
            baptismDate: data.baptismDate || null,
            entryDate: data.entryDate || null,
        };
        onSubmit(finalData);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="member-form" noValidate>
            <div className="row g-3">
                <div className="col-12"><h5>Dados Pessoais</h5></div>
                <div className="col-12 col-md-6">
                    <label htmlFor="fullName" className="form-label">Nome Completo</label>
                    <input type="text" id="fullName" {...register('fullName', { required: 'Nome é obrigatório' })} className={`form-control ${errors.fullName ? 'is-invalid' : ''}`} />
                    {errors.fullName && <div className="invalid-feedback">{errors.fullName.message}</div>}
                </div>
                <div className="col-12 col-md-6">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" id="email" {...register('email')} className="form-control" />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="cpf" className="form-label">CPF</label>
                    <Controller name="cpf" control={control} rules={{ required: 'CPF é obrigatório' }}
                        render={({ field }) => <IMaskInput mask="000.000.000-00" id="cpf" value={field.value || ''} onAccept={field.onChange} className={`form-control ${errors.cpf ? 'is-invalid' : ''}`} />}
                    />
                    {errors.cpf && <div className="invalid-feedback">{errors.cpf.message}</div>}
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="rg" className="form-label">RG</label>
                    <input id="rg" {...register('rg', { required: 'RG é obrigatório' })} className={`form-control ${errors.rg ? 'is-invalid' : ''}`} />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="telephone" className="form-label">Telefone</label>
                    <Controller name="telephone" control={control} rules={{ required: 'Telefone é obrigatório' }}
                        render={({ field }) => <IMaskInput mask="(00) 00000-0000" id="telephone" value={field.value || ''} onAccept={field.onChange} className={`form-control ${errors.telephone ? 'is-invalid' : ''}`} />}
                    />
                    {errors.telephone && <div className="invalid-feedback">{errors.telephone.message}</div>}
                </div>
                <div className="col-12"><hr /><h5>Datas Importantes</h5></div>
                <div className="col-12 col-md-4">
                    <label htmlFor="dateOfBirth" className="form-label">Nascimento</label>
                    <input type="date" id="dateOfBirth" {...register('dateOfBirth', { required: 'Data de nascimento é obrigatória' })} className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`} />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="baptismDate" className="form-label">Batismo (Opcional)</label>
                    <input type="date" id="baptismDate" {...register('baptismDate')} className="form-control" />
                </div>
                <div className="col-12 col-md-4">
                    <label htmlFor="entryDate" className="form-label">Entrada (Opcional)</label>
                    <input type="date" id="entryDate" {...register('entryDate')} className="form-control" />
                </div>

                <div className="col-12"><hr /><h5>Endereço</h5></div>

                <div className="col-12 col-md-4">
                    <label htmlFor="address.zipCode" className="form-label">CEP</label>
                    <Controller name="address.zipCode" control={control} rules={{ required: 'CEP é obrigatório' }}
                        render={({ field }) => (
                            <IMaskInput mask="00000-000" id="address.zipCode" value={field.value || ''} onAccept={field.onChange} className={`form-control ${errors.address?.zipCode ? 'is-invalid' : ''}`} />
                        )}
                    />
                </div>
                <div className="col-12 col-md-8">
                    <label htmlFor="address.street" className="form-label">Logradouro</label>
                    <input id="address.street" {...register('address.street', { required: 'Logradouro é obrigatório' })} className={`form-control ${errors.address?.street ? 'is-invalid' : ''}`} />
                </div>
                <div className="col-12 col-md-6">
                    <label htmlFor="address.number" className="form-label">Numero</label>
                    <input type="text" className="form-control" id="address.number" {...register('address.number', { required: 'coloque o número da residência' })} />
                </div>
                <div className="col-12 col-md-6">
                    <label htmlFor="address.neighborhood" className="form-label">Bairro</label>
                    <input type="text" className="form-control" id="address.neighborhood" {...register('address.neighborhood', { required: 'Bairro é obrigatório' })} />
                </div>
                <div className="col-12 col-md-6">
                    <label htmlFor="address.complement" className="form-label">Complemento</label>
                    <input type="text" className="form-control" id="address.complement" {...register('address.complement')} />
                </div>
                <div className="col-12 col-md-6">
                    <label htmlFor="address.city" className="form-label">Cidade</label>
                    <input type="text" className="form-control" id="address.city" {...register('address.city', { required: 'Cidade é obrigatória' })} />
                </div>
                <div className="col-12 col-md-6">
                    <label htmlFor="address.state" className="form-label">Estado</label>
                    <input type="text" className="form-control" id="address.state" {...register('address.state', { required: 'Estado é obrigatório' })} />
                </div>
                <div className="col-12 col-md-6">
                    <label htmlFor="address.country" className="form-label">País</label>
                    <input type="text" className="form-control" id="address.country" {...register('address.country', { required: 'País é obrigatório' })} />
                </div>
                <div className="col-12 col-md-6">
                    <label htmlFor="address.nationality" className="form-label">Nacionalidade</label>
                    <input type="text" className="form-control" id="address.nationality" {...register('address.nationality', { required: 'Nacionalidade é obrigatória' })} />
                </div>

                <div className="col-12 mt-4">
                    <h5>Outras Informações</h5>
                </div>
                <div className="col-12 col-md-6">
                    <label htmlFor="idChurch" className="form-label">Igreja</label>
                    <select id="idChurch" {...register('idChurch', { required: 'Igreja é obrigatória' })} className={`form-select ${errors.idChurch ? 'is-invalid' : ''}`}>
                        <option value="">Selecione...</option>
                        {churches.map(church => (
                            <option key={church.id} value={church.id}>{church.name}</option>
                        ))}
                    </select>
                    {errors.idChurch && <div className="invalid-feedback">{errors.idChurch.message}</div>}
                </div>
                <div className="col-12 col-md-6 d-flex align-items-center mt-4">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="active" {...register('active')} />
                        <label className="form-check-label" htmlFor="active">Membro Ativo</label>
                    </div>
                </div>
            </div>
            <div className="modal-footer mt-4">
                <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : 'Salvar Membro'}
                </button>
            </div>
        </form>
    );
};

export default MemberForm;