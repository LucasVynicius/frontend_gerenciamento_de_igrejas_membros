import { MinisterialPosition } from "../enums/MinisterialPosition";

const positionTranslations: { [key in MinisterialPosition]: string } = {
    [MinisterialPosition.PRESIDENT]: 'Pastor Presidente',
    [MinisterialPosition.VICE_PRESIDENT]: 'Vice-Presidente',
    [MinisterialPosition.AUXILIARY_PASTOR]: 'Pastor Auxiliar',
    [MinisterialPosition.SHEPHERD]: 'Pastor',
    [MinisterialPosition.DEACON]: 'Diácono',
    [MinisterialPosition.DEACONESS]: 'Diaconisa',
    [MinisterialPosition.EVANGELIST]: 'Evangelista',
    [MinisterialPosition.MISSIONARY]: 'Missionário',
    [MinisterialPosition.COOPERATOR]: 'Cooperador',
};


export const translatePosition = (position: string | null): string => {
    if (!position) {
        return '';
    }
    
    const key = position.toUpperCase() as MinisterialPosition;
    const translated = positionTranslations[key];
    
    return translated || position;
};