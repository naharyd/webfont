const logger = {
    warn: (text: string) => {
        console.warn(text);
    },
    error: (text: string) => {
        console.error(text);
    },
    log: (text: string) => {
        console.log(text);
    },
    verbose: (text: string) => {
        console.log(text);
    },
};


export default logger;
