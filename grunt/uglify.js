/*jslint node:true*/
module.exports = {
    build: {
        src: '<%= concat.concat.dest %>',
        dest: 'build/<%= meta.name %>.min.js'
    }
};
