export interface PermissionResponseDTO {
    id: number;
    name: string;
}

export interface RoleResponseDTO {
    id: number;
    name: string;
    permissions: PermissionResponseDTO[];
}