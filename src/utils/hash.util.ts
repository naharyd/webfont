import crypto from 'crypto';
import fs from 'fs';
import {sync} from 'mkdirp';
import path from 'path';
import {IMergedOptions} from '../interfaces/marged-options.interface';
import logger from './logger';
import Utils from './utils';

const ENCODING = 'utf8';
const HEX_BASE64_LATIN_ENCODING = 'hex';
const HASH = {folderName: 'hash', fileName: 'hash'};

class HashUtil {

    getHash(options: IMergedOptions, svgFiles: string[]): string {
        const md5 = crypto.createHash('md5');
        svgFiles.forEach((svgFile) => {
            md5.update(fs.readFileSync(svgFile, ENCODING));
        });

        md5.update(JSON.stringify(options));

        // var packageJson = require('../package.json');
        // md5.update(packageJson.version);

        if (options.template) {
            md5.update(fs.readFileSync(options.template, ENCODING));
        }
        if (options.htmlDemoTemplate) {
            md5.update(fs.readFileSync(options.htmlDemoTemplate, ENCODING));
        }
        return md5.digest(HEX_BASE64_LATIN_ENCODING);
    }

    isHashWasNotChanged(currentHash: string, options: IMergedOptions): boolean {
        const previousHash = this.getPreviousHash(options.cache);
        logger.verbose(`New hash: ${currentHash} - Previous hash: ${previousHash}`);
        return currentHash === previousHash;
    }

    private getPreviousHash(cachePath: string): string {
        return this.readHash(cachePath);
    }

    /**
     * Read hash from cache file or empty string if file don’t exist.
     *
     * @param {String} cachePath cache folder path.
     * @return {String}
     */
    readHash(cachePath: string): string {
        const filePath: string = this.getHashPath(cachePath);
        return Utils.isFileExist(filePath) ? fs.readFileSync(filePath, ENCODING) : '';
    }

    /**
     * Return path to cache file.
     *
     * @param {String} cachePath cache folder path.
     * @return {String}
     */
    private getHashPath(cachePath: string): string {
        return path.join(cachePath, HASH.folderName, HASH.fileName);
    }

    /**
     * Save hash to cache file.
     *
     * @param {String} hash Hash.
     * @param {String} cachePath cache folder path.
     */
    saveHash(hash: string, cachePath: string) {
        logger.verbose(`Saving new hash: ${hash}`);
        const filePath = this.getHashPath(cachePath);
        sync(path.dirname(filePath));
        fs.writeFileSync(filePath, hash);
    }
}

export default new HashUtil();
