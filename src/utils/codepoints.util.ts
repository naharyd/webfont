import fs from 'fs';
import {includes} from 'lodash';
import {IMergedOptions} from '../interfaces/marged-options.interface';
import logger from './logger';
import Utils from './utils';

class CodepointsUtil {

    generateCodepoints(glyphs: string[], options: IMergedOptions) {
        let {codepoints} = options;
        const {codepointsFile, startCodepoint} = options;
        if (codepointsFile) {
            codepoints = this.readCodepointsFromFile(codepointsFile);
        }
        let currentCodepoint = startCodepoint;
        glyphs.forEach((glyphName: string) => {
            if (!codepoints[glyphName]) {
                currentCodepoint = this.getNextCodepoint(codepoints, currentCodepoint);
                codepoints[glyphName] = currentCodepoint;
            }
        });

        if (codepointsFile) {
            this.saveCodepointsToFile(codepoints, codepointsFile);
        }
        return codepoints;
    }

    /**
     * Gets the codepoints from the set filepath in o.codepointsFile
     */
    readCodepointsFromFile(codepointsFile: string): {[key: string]: number} {
        if (!Utils.isFileExist(codepointsFile)) {
            logger.verbose('Codepoints file not found');
            return {};
        }

        const buffer: Buffer = fs.readFileSync(codepointsFile);
        return JSON.parse(buffer.toString());
    }

    /**
     * Find next unused codepoint.
     *
     * @return {Integer}
     */
    getNextCodepoint(codepoints: {[key: string]: number}, currentCodepoint: number ): number {
        while (includes<number>(codepoints, currentCodepoint)) {
            currentCodepoint++;
        }
        return currentCodepoint;
    }

    /**
     * Saves the codespoints to the set file
     */
    saveCodepointsToFile(codepoints: {[key: string]: number}, codepointsFile: string): void {
        const codepointsToString = JSON.stringify(codepoints, null, 4);
        try {
            fs.writeFileSync(codepointsFile, codepointsToString);
            logger.verbose('Codepoints saved to file "' + codepointsFile + '".');
        } catch (err) {
            logger.error(err.message);
        }
    }

}

export default new CodepointsUtil();
