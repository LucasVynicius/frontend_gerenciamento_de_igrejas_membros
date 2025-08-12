export const MinisterialPosition = {
    PRESIDENT: 'PRESIDENT',
    VICE_PRESIDENT: 'VICE_PRESIDENT',
    AUXILIARY_PASTOR: 'AUXILIARY_PASTOR',
    SHEPHERD: 'SHEPHERD',
    DEACON: 'DEACON',
    DEACONESS: 'DEACONESS',
    EVANGELIST: 'EVANGELIST',
    MISSIONARY: 'MISSIONARY',
    COOPERATOR: 'COOPERATOR',
} as const;

export type MinisterialPosition = typeof MinisterialPosition[keyof typeof MinisterialPosition];