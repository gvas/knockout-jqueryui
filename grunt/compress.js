/*jslint node:true*/
module.exports = {
    release: {
        options: {
            archive: 'dist/<%= meta.name %>.zip',
            pretty: true
        },
        files: [{ expand: true, src: ['**/*.js'], cwd: 'dist' }]
    }
};
