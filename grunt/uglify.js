/*jslint node:true*/
module.exports = {
    release: {
        src: 'dist/<%= meta.name %>.js',
        dest: 'dist/<%= meta.name %>.min.js'
    }
};
