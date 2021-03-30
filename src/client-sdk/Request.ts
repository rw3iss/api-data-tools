//const fetch = require('node-fetch').default;

// adds Authorization header with JWT token, etc...
function _makeRequestOptions(opts) {
	opts = opts || {}

	// let token = _getAccessToken();
	// if (token) {
	//     opts.headers = opts.headers || {};
	//     opts.headers["Authorization"] = opts.headers["Authorization"] || `Bearer ${token}`;
	// }

	return opts
}

export default class Request {
    
	static async get(url, headers) {
		let opts = {
			mode: 'cors',
			method: 'GET',
			// credentials: 'include',
			headers: headers,
            redirect: 'follow'
		}
		opts = _makeRequestOptions(opts)
		return await fetch(url, opts)
	}

	static async post(url, data, headers) {
		let opts = {
			mode: 'cors',
			body: data ? JSON.stringify(data) : undefined,
			method: 'POST',
			// credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				...headers
			},
            redirect: 'follow'
		}
		opts = _makeRequestOptions(opts)

		return await fetch(url, opts).catch(e => {
			console.log('caught request', e)
		})
	}

	static async put(url, data, headers) {
		let opts = {
			mode: 'cors',
			body: data ? JSON.stringify(data) : undefined,
			method: 'PUT',
			// credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
				...headers
			}
		}
		opts = _makeRequestOptions(opts)
		return await fetch(url, opts)
	}

	static async delete(url, headers) {
		let opts = {
			method: 'DELETE',
			headers: headers
		}
		opts = _makeRequestOptions(opts)
		return await fetch(url, opts)
	}

	// Helper to extract error messaging from responses
	static findError(res) {
		return res
			? res.error
				? res.error
				: res.message
				? res.message
				: 'An unknown error occurred.'
			: 'An unknown error occurred.'
	}
}