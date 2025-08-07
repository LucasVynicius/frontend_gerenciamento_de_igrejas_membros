import React from 'react';
import { AuthContext } from './AuthContext';

const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

export default useAuth;
