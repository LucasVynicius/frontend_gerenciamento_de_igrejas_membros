export const formatCpf = (cpf: string): string => {
    const cleanCpf = cpf.replace(/\D/g, '');
    
    return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};