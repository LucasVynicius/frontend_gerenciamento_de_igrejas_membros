export const formatCpf = (cpf: string): string => {
    // Remove qualquer coisa que não seja dígito
    const cleanCpf = cpf.replace(/\D/g, '');
    
    // Aplica a máscara: 999.999.999-99
    return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};