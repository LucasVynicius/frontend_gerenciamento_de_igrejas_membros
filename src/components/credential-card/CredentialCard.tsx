import React from 'react';
import type { CredentialData } from '../../types/credential/Credential';
import { formatCpf } from '../../utils/formatCpf';
import { translatePosition } from '../../utils/translations';
import './CredentialCard.css';

interface CredentialCardProps {
    data: CredentialData;
}

const CredentialCard: React.FC<CredentialCardProps> = ({ data }) => {
    return (
        <div className="credential-card">
            {/* Cabeçalho do Cartão */}
            <div className="card-header">
                <img src="/church-logoCard.png" alt="Logo da Igreja" className="church-logo" />
                <div className="church-name">
                    <h4>{data.churchName.toUpperCase()}</h4>
                    <p>{data.churchTradeName}</p>
                </div>
            </div>

            {/* Corpo do Cartão com Foto e Informações */}
            <div className="card-body">
                <div className="member-photo">
                    {data.photoUrl ? (
                        <img src={`http://localhost:8080${data.photoUrl}`} alt="Foto do Membro" />
                    ) : (
                        <span>Foto 3x4 do Membro</span>
                    )}
                </div>
                <div className="member-info">
                    <h2 className="member-name">{data.fullName}</h2>
                    <p className="member-position">{data.position ? translatePosition(data.position) : "MEMBRO"}</p>
                    
                    <div className="member-details">
                        <p>CPF: <span>{formatCpf(data.cpf)}</span></p>
                        <p>Nascimento: <span>{data.dateOfBirth}</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CredentialCard;