const express = require('express')
require('dotenv').config()
const port = process.env.PORT || 5000

app.listen(port, () => {
	console.log(`App listening on port: ${port}`)
})