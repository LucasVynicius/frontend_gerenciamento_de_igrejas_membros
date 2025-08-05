import type { ChurchRequestDTO } from "../../services/church/ChurchService";
import { RegistryType } from '../../enums/RegistryType';
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import axios from "axios";
import './ChurchForm.css'

interface ChurchFormProps {
    initialData?: Partial<ChurchRequestDTO>;
    onSubmit: (data: ChurchRequestDTO) => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

const ChurchForm: React.FC<ChurchFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting,
}) => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm<ChurchRequestDTO>({
        defaultValues: initialData || {
            name: "",
            tradeName: "",
            registryType: "",
            registryNumber: "",
            foundationDate: "",
            pastorLocalId: null,
            address: {
                street: "",
                number: "",
                complement: "",
                neighborhood: "",
                city: "",
                state: "",
                country: "",
                zipCode: ""
            }
        },
    });

    const handleFormSubmint: SubmitHandler<ChurchRequestDTO> = (data) => {
        onSubmit(data);
    }
    const handleCepBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
        const cep = event.target.value.replace(/\D/g, ''); // Remove caracteres não numéricos

        if (cep.length !== 8) {
            return;
        }

        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            const data = response.data;

            if (!data.erro) {
                setValue('address.street', data.logradouro);
                setValue('address.neighborhood', data.bairro);
                setValue('address.city', data.localidade);
                setValue('address.state', data.uf);
                setValue('address.country', data.pais);
            }
        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmint)} noValidate>
            <div className="row">
                <div className="col-md-6">
                    <label htmlFor="name">Nome</label>
                    <input
                        id="name"
                        {...register("name", { required: "Nome é obrigatório" })}
                        className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>

                <div className="col-md-6">
                    <label htmlFor="tradeName">Nome fantasia</label>
                    <input
                        id="tradeName"
                        {...register("tradeName")}
                        className={`form-control ${errors.tradeName ? "is-invalid" : ""}`}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="registryType" className="form-label">Tipo de Registro</label>
                    <select id="registryType" {...register('registryType')} className="form-select">
                        {Object.values(RegistryType).map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6">
                    <label htmlFor="registryNumber">Número de registro</label>
                    <input
                        id="registryNumber"
                        {...register("registryNumber", { required: "Número de registro é obrigatório" })}
                        className={`form-control ${errors.registryNumber ? "is-invalid" : ""}`}
                    />
                    {errors.registryNumber && <div className="invalid-feedback">{errors.registryNumber.message}</div>}
                </div>
                <div className="col-md-6">
                    <label htmlFor="foundationDate">Data de fundação</label>
                    <input
                        type="date"
                        id="foundationDate"
                        {...register("foundationDate", { required: "Data de fundação é obrigatória" })}
                        className={`form-control ${errors.foundationDate ? "is-invalid" : ""}`}
                    />
                    {errors.foundationDate && <div className="invalid-feedback">{errors.foundationDate.message}</div>}
                </div>
                <div className="col-md-6 mb-3">
                    <label htmlFor="pastorLocalId" className="form-label">ID do Pastor Local (Opcional)</label>
                    <input type="number" id="pastorLocalId" {...register('pastorLocalId', { valueAsNumber: true })} className="form-control" />
                </div>
            </div>

            <hr />
            <h5 className="mt-4">Endereço</h5>
            <div className="row">
                <div className="col-md-8 mb-3">
                    <label htmlFor="address.street" className="form-label">Logradouro</label>
                    <input id="address.street" {...register('address.street', { required: 'Logradouro é obrigatório' })} className="form-control" />
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
                <div className="col-md-6 mb-3">
                    <label htmlFor="address.zipCode" className="form-label">CEP</label>
                    {/* 4. Adicione o evento onBlur no campo do CEP */}
                    <input
                        id="address.zipCode"
                        {...register('address.zipCode', { required: 'CEP é obrigatório' })}
                        className="form-control"
                        onBlur={handleCepBlur}
                    />
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