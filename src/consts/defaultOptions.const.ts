import {IOptions} from '../interfaces/options.interface';
import {ITemplateOptions} from '../interfaces/template-options.interface';
import {FontFaceOrder, FontTypes, Styles, Syntax} from '../types';
import {FontEngine} from '../types/font-engine.enum';

const UNICODE_PUA_START = 0xF101;

const defaultOptions: Partial<IOptions> = {
    fontBaseName: 'icons',
    fontPathVariables: false,
    syntax: Syntax.BEM,
    templateOptions: {} as ITemplateOptions,
    styles: [Styles.FONT, Styles.ICON ],
    types: [FontTypes.WOFF, FontTypes.EOT, FontTypes.TTF],
    order: [FontFaceOrder.EOT, FontFaceOrder.WOFF2, FontFaceOrder.WOFF, FontFaceOrder.TTF, FontFaceOrder.SVG],
    engine: FontEngine.FONTFORGE,
    startCodepoint: UNICODE_PUA_START,
    round: 10e12,
    fontHeight: 512,
    descent: 64,
    execMaxBuffer: 1024 * 200,
    template: '',
    addHashes: true,
    htmlDemo: true,
    autoHint: true,
    optimize: true,
    codepoints: {},
};

export default defaultOptions;
