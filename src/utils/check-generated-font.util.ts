import {some} from 'lodash';
import {IDestCssPaths} from '../interfaces/data.interface';
import {IMergedOptions} from '../interfaces/marged-options.interface';
import {Stylesheets} from '../types/stylesheets.enum';
import logger from './logger';
import Utils from './utils';


class CheckGeneratedFontUtil {

    noNeedsToGenerateNewFont(options: IMergedOptions, destCssPaths: IDestCssPaths): boolean {
        logger.verbose('Config and source files weren’t changed since last run, checking resulting files...');
        const generatedFiles: string[] = Utils.generatedFontFiles(options.types, options.dest, options.fontFilename);
        return this.foundFiles(generatedFiles) && this.areAllRequiredFilesExist(options, destCssPaths, generatedFiles);
    }

    private foundFiles(generatedFiles: string[]): boolean {
        return !!generatedFiles.length;
    }

    private areAllRequiredFilesExist(options: IMergedOptions, destCssPaths: IDestCssPaths, generatedFiles: string[]): boolean {
        this.addDemoPath(options, generatedFiles);
        this.addStylesheetsPath(options, destCssPaths, generatedFiles);
        return this.allFilesExist(generatedFiles);
    }

    private addDemoPath(options: IMergedOptions, generatedFiles: string[]): void {
        generatedFiles.push(Utils.getDemoFilePath(options));
    }

    private addStylesheetsPath(options: IMergedOptions, destCssPaths: IDestCssPaths, generatedFiles: string[]): void {
        // need to check multicolor and scss reference file
        options.stylesheets.forEach((stylesheet: Stylesheets) => {
            generatedFiles.push(Utils.getCssFilePath(stylesheet, options.fontBaseName, destCssPaths));
        });
    }

    private allFilesExist(generatedFiles: string[]): boolean {
        return some<string>(generatedFiles, this.isFilesExist);
    }

    private isFilesExist(filename: string): boolean {
        if (!filename) {
            return false;
        }
        if (!Utils.isFileExist(filename)) {
            logger.verbose(`File ${filename} is missed.`);
            return true;
        }
        return false;
    }

}

export default new CheckGeneratedFontUtil();
