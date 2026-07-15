const Express=require("express")
const Mongoose=require("mongoose")
const Cors=require("cors")
const Bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const userModel=require("./models/users")

let app=Express()
app.use(Express.json())
app.use(Cors())

Mongoose.connect("mongodb://anaghaajidev:Anagha23@ac-agnsoij-shard-00-00.lk3iujt.mongodb.net:27017,ac-agnsoij-shard-00-01.lk3iujt.mongodb.net:27017,ac-agnsoij-shard-00-02.lk3iujt.mongodb.net:27017/blogapp_db?ssl=true&replicaSet=atlas-bjgzxl-shard-0&authSource=admin&appName=Cluster0")


app.post("/signup",async(req,res)=>{

    let input=req.body
    let hashedPassord=Bcrypt.hashSync(req.body.password,10)
    console.log(hashedPassord)
    req.body.password=hashedPassord
   

    let check= userModel.find({email:req.body.email}).then(
        (items)=>{
            if (items.length>0){
        res.json({"status":"Email ID already exist"})
    }
    else{
        let result=new userModel(input)
         result.save()
        res.json({"status":"success"})
    }
        }
    ).catch(
        (error)=>{}
    )
    

})

app.listen(3030,()=>{
    console.log("server started")
})