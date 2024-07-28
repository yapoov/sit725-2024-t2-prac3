const express = require('express')
const app = express()
var port = process.env.port || 3000;

app.use(express.static(__dirname+'/public'))
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.listen(port,()=>{
    console.log("App listening to: "+ port)
})