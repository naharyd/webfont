import {IMergedOptions} from './marged-options.interface';

export interface IData {
    options: IMergedOptions;
    destCssPaths: IDestCssPaths;
    fontName: string;
    hash: string;
    relativeFontPath: string;
    fontfaceStyles: boolean;
    baseStyles: boolean;
    extraStyles: boolean;
    files: string[];
    glyphs: string[];
}

export interface IDestCssPaths {
    css: string;
    scss: string;
    sass: string;
    less: string;
    styl: string;
}
