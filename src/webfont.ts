/* https://itnext.io/step-by-step-building-and-publishing-an-npm-typescript-package-44fe7164964c */

import chalk from 'chalk';
import globby from 'globby';
import path from 'path';
import defaultOptions from './consts/defaultOptions.const';
import {IData, IDestCssPaths} from './interfaces/data.interface';
import {IMergedOptions} from './interfaces/marged-options.interface';
import {IOptions} from './interfaces/options.interface';
import {Styles} from './types/styles.enum';
import {Stylesheets} from './types/stylesheets.enum';
import CheckGeneratedFontUtil from './utils/check-generated-font.util';
import CodepointsUtil from './utils/codepoints.util';
import HashUtil from './utils/hash.util';
import logger from './utils/logger';
import Utils from './utils/utils';

export const Greeter = (name: string) => `Hello ${name}`;

const _options: IOptions = {
    dest: './dist/icons',
    src: 'svg/**/*.svg',
};

console.log(Greeter('dan'));

logger.log('Compile separate SVG files to webfont');

webFont(_options);

export async function webFont (initialOptions: IOptions) {
    if (guards(initialOptions)) {
        return;
    }

    const files: string[] = await getSvgFilesList(initialOptions.src);
    if (files.length === 0) {
        throw new Error('Files glob patterns specified did not match any files');
    }
    const data: IData = getData(initialOptions, files);
    if (HashUtil.isHashWasNotChanged(data.hash, data.options) &&
        CheckGeneratedFontUtil.noNeedsToGenerateNewFont(data.options, data.destCssPaths)) {
        logger.log(`Font ${chalk.cyan(data.fontName)} wasn’t changed since last run.`);
        return;
    }

    HashUtil.saveHash(data.hash, data.options.cache);
}

function guards(initialOptions: IOptions): boolean {
    if (!initialOptions) {
        throw new Error('You must pass configurations');
    } else if (!initialOptions.src) {
        throw new Error('Required property "src" missing.');
    } else if (!initialOptions.dest) {
        throw new Error('Required property "dest" missing.');
    } else if (initialOptions.skip) {
        return true;
    }
    return false;
}

async function getSvgFilesList(src: string): Promise<string[]> {
    const foundFiles: string[] = await globby([src]);
    return foundFiles.filter(
        foundFile => Utils.getFileExtension(foundFile) === '.svg'
    ).sort();
}

function getData(initialOptions: IOptions, files: string[]): IData {
    const options = getMergedOptions(initialOptions);
    const destCssPaths = getDestCssPaths(options);
    const fontName = options.fontBaseName;
    const relativeFontPath = options.relativeFontPath;
    const styles = options.styles;
    const fontfaceStyles: boolean = Utils.has<Styles>(styles, Styles.FONT);
    const baseStyles: boolean = Utils.has<Styles>(styles, Styles.ICON);
    const extraStyles: boolean = Utils.has<Styles>(styles, Styles.EXTRA);
    const glyphs: string[] = getGlyphs(options, files);
    options.codepoints = CodepointsUtil.generateCodepoints(glyphs, options);
    return {
        fontName,
        options,
        files,
        destCssPaths,
        relativeFontPath,
        fontfaceStyles,
        baseStyles,
        extraStyles,
        glyphs,
        hash: HashUtil.getHash(options, files),
    };
}

function getMergedOptions(initialOptions: IOptions): IMergedOptions {
    const destCss: string = initialOptions.destCss || initialOptions.dest;
    const destScss: string = initialOptions.destScss || initialOptions.destCss || initialOptions.dest;
    const destSass: string = initialOptions.destSass || initialOptions.destCss || initialOptions.dest;
    const destLess: string = initialOptions.destLess || initialOptions.destCss || initialOptions.dest;
    const destStyl: string = initialOptions.destStyl || initialOptions.destCss || initialOptions.dest;
    const relativeFontPath: string = initialOptions.relativeFontPath || path.relative(destCss, initialOptions.dest);
    const stylesheets: Stylesheets[] = initialOptions.stylesheets ||
        [getStylesheetsTypeFromTemplate(initialOptions) ];
    const rename: (name: string) => string = initialOptions.rename || path.basename;
    const cache: string = initialOptions.cache || path.join(__dirname, '..', '.cache');
    const fontBaseName: string = initialOptions.fontBaseName || (defaultOptions.fontBaseName as string);
    const fontFilename: string =  initialOptions.fontFilename || fontBaseName; // template(options.fontFilename || o.fontBaseName, options),
    const fontFamilyName: string = initialOptions.fontFamilyName || fontBaseName;
    // template(options.fontFilename || o.fontBaseName, options)
    const destHtml: string = initialOptions.destHtml || destCss;
    const newOptions: Partial<IOptions> = {
        destCss,
        destScss,
        destSass,
        destLess,
        destStyl,
        relativeFontPath,
        stylesheets,
        rename,
        cache,
        fontFilename,
        fontFamilyName,
        destHtml,
    };
    return Object.assign({},
        defaultOptions,
        initialOptions,
        newOptions) as IMergedOptions;
}

function getStylesheetsTypeFromTemplate(initialOptions: IOptions): Stylesheets {
    const template: string = initialOptions.template || defaultOptions.template || '';
    const _default = Stylesheets.CSS;
    return (Utils.getFileExtension(template).replace(/^\./, '') as Stylesheets) || _default;
}


function getDestCssPaths(options: IMergedOptions): IDestCssPaths {
    const {destCss, destLess, destSass, destScss, destStyl} = options;
    return {
        css: destCss,
        scss: destLess,
        sass: destSass,
        less: destScss,
        styl: destStyl,
    };
}

function getGlyphs(options: IMergedOptions, files: string[]): string[] {
    return files.map((file) => renameFile(file, options.rename).replace(Utils.getFileExtension(file), ''));
}

function renameFile(file: string, rename: (name: string) => string) {
    return rename(file);
}


