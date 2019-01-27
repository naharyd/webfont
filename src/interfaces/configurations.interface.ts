import { Embed } from '../types/embed.enum';
import { FontEngine } from '../types/font-engine.enum';
import { FontFaceOrder } from '../types/font-face-order.enum';
import { FontTypes } from '../types/font-types.enum';
import { Styles } from '../types/styles.enum';
import { Stylesheets } from '../types/stylesheets.enum';
import { Syntax } from '../types/syntax.enum';
import { ITemplateOptions } from './template-options.interface';

export interface IConfigurations {
    fontBaseName?: string;
    destCss?: string;
    destScss?: string;
    destSass?: string;
    destLess?: string;
    destStyl?: string;
    dest: string;
    src: string;
    relativeFontPath: string | null;
    fontPathVariables: boolean;
    addHashes: boolean;
    addLigatures: boolean;
    template?: string;
    syntax: Syntax;
    templateOptions?: ITemplateOptions;
    stylesheets?: Stylesheets[];
    htmlDemo?: boolean;
    htmlDemoTemplate?: string;
    htmlDemoFilename?: string;
    styles?: Styles[];
    types?: FontTypes[];
    order?: FontFaceOrder[];
    embed?: Embed[];
    rename?: (name: string) => string;
    engine?: FontEngine;
    autoHint?: boolean;
    codepoints?: any;
    codepointsFile?: string;
    startCodepoint?: number;
    normalize?: boolean;
    optimize?: boolean;
    round?: number;
    fontHeight?: number;
    descent?: number;
    version?: boolean | string;
    cache?: any;
    callback?: (filename: string, types: any[], glyphs: any[], hash: string) => void;
    customOutputs?: Array<{template: string, dest: string, context?: {[key: string]: any} }>;
    execMaxBuffer?: number;
    skip?: boolean;
}
