// src/components/member-form/MemberForm.tsx

import React, { useState, useEffect } from "react";
import type { MemberRequestDTO } from "../../dtos/MemberRequestDTO";
import "./MemberForm.css";

interface MemberFormProps {
  initialData?: MemberRequestDTO;
  onSubmit: (data: MemberRequestDTO) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const emptyMember: MemberRequestDTO = {
  fullName: "",
  cpf: "",
  rg: "",
  telephone: "",
  email: "",
  dateOfBirth: "",
  baptismDate: "",
  entryDate: "",
  active: true,
  address: {
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "",
    nationality: "",
    zipCode: "",
  },
  idChurch: null,
};

const MemberForm: React.FC<MemberFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<MemberRequestDTO>(emptyMember);

  useEffect(() => {
    if (initialData) {
      const formattedData = {
        ...initialData,
        dateOfBirth: initialData.dateOfBirth
          ? new Date(initialData.dateOfBirth).toISOString().split("T")[0]
          : "",
        baptismDate: initialData.baptismDate
          ? new Date(initialData.baptismDate).toISOString().split("T")[0]
          : "",
        entryDate: initialData.entryDate
          ? new Date(initialData.entryDate).toISOString().split("T")[0]
          : "",
      };
      setFormData(formattedData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" && "checked" in e.target
        ? (e.target as HTMLInputElement).checked
        : undefined;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [addressField]: value,
        },
      }));
    } else if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else if (name === "idChurch") {
      setFormData((prevData) => ({
        ...prevData,
        idChurch: value === "" ? null : Number(value),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="member-form">
      <div className="row g-3">
        <div className="col-12">
          <h5>Dados Pessoais</h5>
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="fullName" className="form-label">Nome Completo</label>
          <input type="text" className="form-control" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-4">
          <label htmlFor="cpf" className="form-label">CPF</label>
          <input type="text" className="form-control" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-4">
          <label htmlFor="rg" className="form-label">RG</label>
          <input type="text" className="form-control" id="rg" name="rg" value={formData.rg} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-4">
          <label htmlFor="telephone" className="form-label">Telefone</label>
          <input type="tel" className="form-control" id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-4">
          <label htmlFor="dateOfBirth" className="form-label">Data de Nascimento</label>
          <input type="date" className="form-control" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth || ""} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-4">
          <label htmlFor="baptismDate" className="form-label">Data de Batismo</label>
          <input type="date" className="form-control" id="baptismDate" name="baptismDate" value={formData.baptismDate || ""} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-4">
          <label htmlFor="entryDate" className="form-label">Data de Entrada</label>
          <input type="date" className="form-control" id="entryDate" name="entryDate" value={formData.entryDate || ""} onChange={handleChange} required />
        </div>

        <div className="col-12 mt-4">
          <h5>Endereço</h5>
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="address.street" className="form-label">Rua</label>
          <input type="text" className="form-control" id="address.street" name="address.street" value={formData.address.street} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="address.number" className="form-label">Número</label>
          <input type="text" className="form-control" id="address.number" name="address.number" value={formData.address.number} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="address.neighborhood" className="form-label">Bairro</label>
          <input type="text" className="form-control" id="address.neighborhood" name="address.neighborhood" value={formData.address.neighborhood} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="address.zipCode" className="form-label">CEP</label>
          <input type="text" className="form-control" id="address.zipCode" name="address.zipCode" value={formData.address.zipCode} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="address.city" className="form-label">Cidade</label>
          <input type="text" className="form-control" id="address.city" name="address.city" value={formData.address.city} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="address.state" className="form-label">Estado</label>
          <input type="text" className="form-control" id="address.state" name="address.state" value={formData.address.state} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="address.country" className="form-label">País</label>
          <input type="text" className="form-control" id="address.country" name="address.country" value={formData.address.country} onChange={handleChange} required />
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="address.nationality" className="form-label">Nacionalidade</label>
          <input type="text" className="form-control" id="address.nationality" name="address.nationality" value={formData.address.nationality} onChange={handleChange} required />
        </div>

        <div className="col-12 mt-4">
          <h5>Outras Informações</h5>
        </div>
        <div className="col-12 col-md-6">
          <label htmlFor="idChurch" className="form-label">Igreja</label>
          <select className="form-select" id="idChurch" name="idChurch" value={formData.idChurch || ""} onChange={handleChange} required>
            <option value="" disabled>Selecione uma igreja...</option>
            <option value="1">Igreja Graça e Reino Central</option>
            <option value="2">Igreja Vida Nova</option>
          </select>
        </div>
        <div className="col-12 mt-3">
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="active" name="active" checked={formData.active} onChange={handleChange} />
            <label className="form-check-label" htmlFor="active">Membro Ativo</label>
          </div>
        </div>
      </div>

      <div className="modal-footer mt-4">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
};

export default MemberForm;