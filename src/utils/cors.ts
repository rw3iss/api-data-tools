exports.enableCors = (req, res, next) => {
    //res.set('Strict-Transport-Security', false);
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', '*')
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Max-Age', '3600')

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
		//res.write('');
        res.end();
    }

    return next ? next() : undefined;
}