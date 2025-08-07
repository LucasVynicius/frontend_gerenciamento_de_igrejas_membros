import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import axios from 'axios';
import type { ChurchRequestDTO } from '../../services/church/ChurchService';
import { RegistryType } from '../../enums/RegistryType';
import './ChurchForm.css';

interface ChurchFormProps {
    initialData?: Partial<ChurchRequestDTO>;
    onSubmit: (data: ChurchRequestDTO) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

const ChurchForm: React.FC<ChurchFormProps> = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
    const { control, handleSubmit, formState: { errors }, setValue, register } = useForm<ChurchRequestDTO>({
        defaultValues: initialData || {
            name: '',
            tradeName: '',
            registryType: RegistryType.CNPJ,
            registryNumber: '',
            foundationDate: '',
            pastorLocalId: null,
            address: {
                street: '',
                number: '',
                complement: '',
                neighborhood: '',
                city: '',
                state: '',
                country: '',
                zipCode: '',
                nationality: ''
            }
        },
    });

    const handleCepBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
        const cep = event.target.value.replace(/\D/g, '');
        if (cep.length !== 8) return;

        try {
            const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (!data.erro) {
                setValue('address.street', data.logradouro, { shouldValidate: true });
                setValue('address.neighborhood', data.bairro, { shouldValidate: true });
                setValue('address.city', data.localidade, { shouldValidate: true });
                setValue('address.state', data.uf, { shouldValidate: true });
                setValue('address.country', 'Brasil', { shouldValidate: true });
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
        }
    };

    const handleFormSubmit: SubmitHandler<ChurchRequestDTO> = (data) => {

        const finalData = {
            ...data,
            pastorLocalId: data.pastorLocalId ? Number(data.pastorLocalId) : null,
        };
        onSubmit(finalData);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="church-form" noValidate>
            <div className="row g-3">
                {/* --- DADOS DA IGREJA --- */}
                <div className="col-12"><h5>Dados da Igreja</h5></div>

                <div className="col-md-6">
                    <label htmlFor="name" className="form-label">Nome da Igreja</label>
                    <input id="name" {...register('name', { required: 'Nome é obrigatório' })} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="tradeName" className="form-label">Nome Fantasia</label>
                    <input id="tradeName" {...register('tradeName', { required: 'Nome Fantasia é obrigatório' })} className={`form-control ${errors.tradeName ? 'is-invalid' : ''}`} />
                    {errors.tradeName && <div className="invalid-feedback">{errors.tradeName.message}</div>}
                </div>

                <div className="col-md-4">
                    <label htmlFor="registry.tipoRegistro" className="form-label">Tipo de Registro</label>
                    <select id="registryType" {...register('registryType')} className="form-select">
                        {Object.values(RegistryType).map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>

                <div className="col-md-8">
                    <label htmlFor="registry.numeroRegistro" className="form-label">Número do Registro</label>
                    <Controller name="registryNumber" control={control} rules={{ required: 'Número de registro é obrigatório' }}
                        render={({ field }) => (
                            <IMaskInput
                                mask={[{ mask: '00.000.000/0000-00' }, { mask: '000000000' }]}
                                id="registry.numeroRegistro" value={field.value || ''} onAccept={field.onChange}
                                className={`form-control ${errors.registryNumber ? 'is-invalid' : ''}`}
                            />
                        )}
                    />
                    {errors.registryType && <div className="invalid-feedback">{errors.registryType.message}</div>}
                    {errors.registryNumber && <div className="invalid-feedback">{errors.registryNumber.message}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="foundationDate" className="form-label">Data de Fundação</label>
                    <input type="date" id="foundationDate" {...register('foundationDate', { required: 'Data de fundação é obrigatória' })} className={`form-control ${errors.foundationDate ? 'is-invalid' : ''}`} />
                    {errors.foundationDate && <div className="invalid-feedback">{errors.foundationDate.message}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="pastorLocalId" className="form-label">ID do Pastor Local (Opcional)</label>
                    <input type="number" id="pastorLocalId" {...register('pastorLocalId')} className="form-control" />
                </div>

                <div className="col-12"><hr /><h5>Endereço</h5></div>

                <div className="col-md-4">
                    <label htmlFor="address.zipCode" className="form-label">CEP</label>
                    <Controller name="address.zipCode" control={control} rules={{ required: 'CEP é obrigatório' }}
                        render={({ field }) => (
                            <IMaskInput mask="00000-000" id="address.zipCode" value={field.value || ''} onAccept={field.onChange} onBlur={handleCepBlur} className={`form-control ${errors.address?.zipCode ? 'is-invalid' : ''}`} />
                        )}
                    />
                </div>
                <div className="col-md-8">
                    <label htmlFor="address.street" className="form-label">Logradouro</label>
                    <input id="address.street" {...register('address.street', { required: 'Logradouro é obrigatório' })} className={`form-control ${errors.address?.street ? 'is-invalid' : ''}`} />
                </div>
                <div className="col-md-4 mb-3">
                    <label htmlFor="address.number" className="form-label">Número</label>
                    <input id="address.number" {...register('address.number', { required: 'Número é obrigatório' })} className="form-control" />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="address.neighborhood" className="form-label">Bairro</label>
                    <input id="address.neighborhood" {...register('address.neighborhood', { required: 'Bairro é obrigatório' })} className="form-control" />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="address.complement" className="form-label">Complemento</label>
                    <input id="address.complement" {...register('address.complement')} className="form-control" />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="address.city" className="form-label">Cidade</label>
                    <input id="address.city" {...register('address.city', { required: 'Cidade é obrigatória' })} className="form-control" />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="address.state" className="form-label">Estado</label>
                    <input id="address.state" {...register('address.state', { required: 'Estado é obrigatório' })} className="form-control" />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="address.country" className="form-label">País</label>
                    <input id="address.country" {...register('address.country', { required: 'País é obrigatório' })} className="form-control" />
                </div>
                <div className="col-md-8">
                    <label htmlFor="address.nationality" className="form-label">Nacionalidade</label>
                    <input id="address.nationality" {...register('address.nationality', { required: 'Nacionalidade é obrigatória' })} className={`form-control ${errors.address?.nationality ? 'is-invalid' : ''}`} />
                </div>
            </div>

            <div className="modal-footer mt-4">
                <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={isSubmitting}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Salvando...' : 'Salvar Igreja'}
                </button>
            </div>
        </form>
    );
};

export default ChurchForm;