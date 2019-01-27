import {Stylesheets} from '../types/stylesheets.enum';

export const CSS_FILE_PREFIXES = {
    [Stylesheets.CSS]: '',
    [Stylesheets.LESS]: '',
    [Stylesheets.SASS]: '_',
    [Stylesheets.SCSS]: '_',
};
