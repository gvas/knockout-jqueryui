/*jslint node:true*/
module.exports = {
    release: {
        options: {
            archive: 'dist/<%= meta.name %>-amd.zip',
            pretty: true
        },
        files: [{ expand: true, src: ['**/*.js'], cwd: 'dist/amd' }]
    }
};
