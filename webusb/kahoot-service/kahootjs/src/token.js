import consts from './consts.js';

class TokenJS {
	static requestToken(sessionID, callback) {
		// Make a GET request to the endpoint and get 2 tokens
		const endpoint = 'https://kahoot.it' + consts.TOKEN_ENDPOINT + sessionID + "/?" + (new Date).getTime();
		let token1;
		return fetch(endpoint, {
			host: consts.ENDPOINT_URI,
			path: endpoint,
			port: consts.ENDPOINT_PORT,
			headers: {
				'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36',
				'host': 'kahoot.it',
				'referer': 'https://kahoot.it/',
				'accept-language': 'en-US,en;q=0.8',
				'accept': '*/*'
			}
		}).then(res => {
			// The first token is the session token, which is given as a header by the server encoded in base64
			if (!res.headers.get("x-kahoot-session-token")) {
				throw new Error("Kahoot session header undefined, the room problably does not exist.")
			}
			token1 = res.headers.get('x-kahoot-session-token');
			return res.json()
		}).then(data => {
			// The second token is given as a "challenge", which must be eval'd by the client to be decoded
			let challenge = data.challenge;
			callback(token1, challenge);
		}).catch(err => {
			console.log('request error:', err);
			throw new Error(err);
		});
	}
	static solveChallenge(challenge) {
		let solved = "";
		challenge = challenge.replace(/(\u0009|\u2003)/mg, "");
		challenge = challenge.replace(/this /mg, "this");
		challenge = challenge.replace(/ *\. */mg, ".");
		challenge = challenge.replace(/ *\( */mg, "(");
		challenge = challenge.replace(/ *\) */mg, ")");
		// Prevent any logging from the challenge, by default it logs some debug info
		challenge = challenge.replace("console.", "");
		// Make a few if-statements always return true as the functions are currently missing
		challenge = challenge.replace("this.angular.isObject(offset)", "true");
		challenge = challenge.replace("this.angular.isString(offset)", "true");
		challenge = challenge.replace("this.angular.isDate(offset)", "true");
		challenge = challenge.replace("this.angular.isArray(offset)", "true");
		(() => {
			// Concat the method needed in order to solve the challenge, then eval the string
			let solver = Function(consts.EVAL_ + challenge);
			// Execute the string, and get back the solved token
			solved = solver().toString();
		})();
		return solved;
	}
	static decodeBase64(b64) {
		// for the session token
		try {
			return atob(b64);
		} catch (e) {
			console.error("Most likely not a kahoot game");
			throw e;
		}
	}
	static concatTokens(headerToken, challengeToken) {
		// Combine the session token and the challenge token together to get the string needed to connect to the websocket endpoint
		let token = "";
		for (let i = 0; i < headerToken.length; i++) {
		    let char = headerToken.charCodeAt(i);
		    let mod = challengeToken.charCodeAt(i % challengeToken.length);
		    let decodedChar = char ^ mod;
		    token += String.fromCharCode(decodedChar);
		}
		return token;
	}
	static resolve(sessionID, callback) {
		let me = this;
		me.requestToken(sessionID, (headerToken, challenge) => {
			let token1 = this.decodeBase64(headerToken);
			let token2 = this.solveChallenge(challenge);
			let resolvedToken = this.concatTokens(token1, token2);
			callback(resolvedToken);
		});
	}
}

export default TokenJS;