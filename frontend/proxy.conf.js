const PROXY_CONFIG = [
    {
        context : '/api',
        target :  process.env['BACKEND_URI'] || 'http://localhost:80',
        secure : false
    }
];

module.exports = PROXY_CONFIG;