import fs from 'fs';
import globby from 'globby';
import path from 'path';
import {CSS_FILE_PREFIXES} from '../consts/constants.const';
import {IDestCssPaths} from '../interfaces/data.interface';
import {IMergedOptions} from '../interfaces/marged-options.interface';
import {FontTypes} from '../types/font-types.enum';
import {Stylesheets} from '../types/stylesheets.enum';

const NOT_FOUND = -1;

class Utils {
    /**
     * Check if a value exists in an array
     *
     * @param {Array} haystack Array to find the needle in
     * @param {Mixed} needle Value to find
     * @return {Boolean} Needle was found
     */
    has<T>(haystack: T[], needle: T): boolean {
        return haystack.indexOf(needle) !== NOT_FOUND;
    }

    /**
     * Basic template function: replaces {variables}
     *
     * @param {Template} tmpl Template code
     * @param {Object} context Values object
     * @return {String}
     */
    template(tmpl: string, context: {[key: string]: string}): string {

        return tmpl.replace(/\{([^\}]+)\}/g, (_, key: string) => {
            return context[key];
        });
    }

    /**
     * Return if file exist.
     *
     * @param {String} filePath File path.
     * @return {Boolean}
     */
    isFileExist(filePath: string): boolean {
        return fs.existsSync(filePath);
    }

    /**
     * Return the extension of the path, from the last '.' to end of string in the last portion of the path.
     * If there is no '.' in the last portion of the path or the first character of it is '.', then it returns an empty string
     *
     * @param file the file to evaluate.
     */
    getFileExtension(file: string): string {
        return path.extname(file);
    }

    /**
     * Returns list of all generated font files.
     *
     * @param {FontTypes} types FontTypes Options.
     * @param {string} dest Options.
     * @param {string} fontFilename Options.
     * @return {Array}
     */
    generatedFontFiles(types: FontTypes[], dest: string, fontFilename: string): string[] {
        const mask = '*.{' + types + '}';
        return globby.sync(path.join(dest, fontFilename + mask));
    }

    /**
     * Return path of HTML demo file or empty string if its generation was disabled.
     *
     * @param {IMergedOptions} options Options.
     * @return {String}
     */
    getDemoFilePath(options: IMergedOptions): string {
        if (!options.htmlDemo) {
            return '';
        }
        const htmlDemofileName: string = options.htmlDemoFilename || options.fontBaseName;
        return path.join(options.destHtml, htmlDemofileName + '.html');
    }

    /**
     * Return path of CSS file.
     *
     * @param {String} stylesheet (css, scss, ...)
     * @return {String}
     */
    getCssFilePath(stylesheet: Stylesheets, fontBaseName: string, destCssPaths: IDestCssPaths): string {
        const cssFilePrefix = CSS_FILE_PREFIXES[stylesheet];
        const destStylePath: string = destCssPaths[stylesheet];
        const fileName = `${cssFilePrefix}${fontBaseName}.${stylesheet}`;
        return path.join(destStylePath, fileName);
    }
}

export default new Utils();
