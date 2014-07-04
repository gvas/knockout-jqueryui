/*jslint node:true*/
module.exports = {
    build: {
        src: '<%= concat.wrap.dest %>',
        dest: 'build/<%= meta.name %>.min.js'
    }
};