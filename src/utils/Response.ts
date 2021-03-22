export default class Response {
	static success(res, data) {
		const r = {
			success: true
		}

		if (data) {
			r.data = data
		}

		res.status(200).send(r)
	}

	static error(res, error, status = 500) {
		const r = {
			success: false
		}

        // todo: if live, return obfustaced error
        if (process.env.NODE_ENV == "production") {
            // todo:
            error = "An unknown error has occurred.";
        }

		if (error) {
			r.error = error // JSON.stringify(error);
		}

		res.status(status).send(r)
	}
}