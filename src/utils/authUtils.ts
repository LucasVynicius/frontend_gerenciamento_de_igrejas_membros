interface AuthToken{
    accessToken: string | null;
    refreshToken: string | null;
}

export const getAuth = (): AuthToken => {
    return {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken')
    };
};

export const removeAuth = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}