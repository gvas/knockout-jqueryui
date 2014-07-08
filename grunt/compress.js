/*jslint node:true*/
module.exports = {
    build: {
        options: {
            archive: 'build/<%= meta.name %>-amd.zip',
            pretty: true
        },
        files: [{ expand: true, src: ['*.js'], cwd: 'src' }]
    }
};
