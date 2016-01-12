export const runPolyfills = () => {
    if (!String.prototype.includes) {
        String.prototype.includes = function(object) {
            return this.indexOf(object) !== -1;
        };
    }
};
