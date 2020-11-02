const bcrypt = require("bcryptjs")
const Users = require("./users-model")

function restrict() {
	// Create a middleware function that restricts routes to authorized users only.
	// It should get the username and password from the request headers.


	//create a middleware function that restricts the Get/users route to authorized user only
	// it should get the username and password from the request headers
	return async (req, res, next) => {
		try {
			const { username, password } = req.headers

			//check the username and password before moving on
			if (!username || !password) {
				return res.status(401).json ({
					message: "invalid"
				})
			}
			const user = await Users.findBy({ username }).first()
			if (!user) {
				return res.status(401).json({
					message: "invalid"
				})
			}
			const passwordValid = await bcrypt.compare(password, user.password)

			if (!passwordValid) {
				return res.status(401).json({
					message: "invalid"
				})
			}


			if(!req.session || !req.session.user) {
				return res.status(401).json({
					message: "invalid"
				})
			}

			//everything validated, were good to go

			next()

		} catch(err) {
			next(err)
		}
	}
}


module.exports = {
	restrict,
} 