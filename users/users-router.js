const express = require("express")
const bcrypt = require("bcryptjs")
const Users = require("./users-model")
const { restrict } = require("./users-middleware")

const router = express.Router()
// add the restrict fucntion to continue
router.get("/users", restrict(), async (req, res, next) => {
	try {
		res.json(await Users.find())
	} catch(err) {
		next(err)
	}
})

router.post("/users", async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await Users.findBy({ username }).first()

		if (user) {
			return res.status(409).json({
				message: "Username is already taken",
			})
		}

		const newUser = await Users.add({
			username,
			//hash the password with a time complexity of 10 or greater
			//password,
			password: await bcrypt.hash(password, 14)
		})

		res.status(201).json(newUser)
	} catch(err) {
		next(err)
	}
})

router.post("/login", async (req, res, next) => {
	try {
		const { username, password } = req.body
		const user = await Users.findBy({ username }).first()
		// why does this not work
		// if (!user || user.password !== password{
		//  look below })

		
		if (!user) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}
		//move this below the user check
		const passwordValid = await bcrypt.compare(password, user.password)

		if (!passwordValid) {
			return res.status(401).json({
				message: "Invalid Credentials"
			})
		}
		// will
		req.session.user = user

		res.json({
			message: `Welcome ${user.username}!`,
		})
	} catch(err) {
		next(err)
	}
})

router.get("/logout", async (req, res, next) => {
	try {
		// deletes the session on the server-side, so the user is no longer authenticated
		req.session.destroy((err) => {
			if (err) {
				next(err)
			} else {
				res.status(204).end()
			}
		})
	} catch (err) {
		next(err)
	}
})

module.exports = router