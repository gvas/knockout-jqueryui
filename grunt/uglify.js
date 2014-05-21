/*jslint node:true*/
module.exports = {
    build: {
        src: '<%= concat.build.dest %>',
        dest: 'build/<%= meta.name %>.min.js'
    }
};