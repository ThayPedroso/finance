const path = require('path')

const rootDir = require('../util/path')

module.exports = {
    async home (req, res) {
        res.status(200).sendFile(path.join(rootDir, 'views', 'index.html'))
    }
}