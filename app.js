const Express=require("express")
const Mongoose=require("mongoose")
const Cors=require("cors")
const Bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const userModel=require("./models/users")
const postModel = require("./models/posts");

let app=Express()
app.use(Express.json())
app.use(Cors())

Mongoose.connect("mongodb://anaghaajidev:Anagha23@ac-agnsoij-shard-00-00.lk3iujt.mongodb.net:27017,ac-agnsoij-shard-00-01.lk3iujt.mongodb.net:27017,ac-agnsoij-shard-00-02.lk3iujt.mongodb.net:27017/blogapp_db?ssl=true&replicaSet=atlas-bjgzxl-shard-0&authSource=admin&appName=Cluster0")

//create a post
app.post("/create", async (req, res) => {

    let input = req.body;
    let token = req.headers.token;

    jwt.verify(token, "blogApp", async (error, decoded) => {

        if (error) {
            return res.json({
                status: "Invalid Token"
            });
        }

        input.postedDate = new Date();

        let result = new postModel(input);

        await result.save();

        res.json({
            status: "Success"
        });

    });

});

//signIn
app.post("/signin",async(req,res)=>{

    let input=req.body
    let result=userModel.find({email:req.body.email}).then(
        (items)=>{
            if (items.length>0) {
                
                const passwordValidator=Bcrypt.compareSync(req.body.password,items[0].password)
                if (passwordValidator) {
                    jwt.sign({email:req.body.email},"blogApp",{expiresIn:"1d"},
                        (error,token)=>{

                            if (error) {
                                res.json({"status":"Error","error":error})

                            } else {
                                res.json({"status":"Success","token":token,"userId":items[0]._id})

                            }
                        })


                } else {
                    res.json({"status":"Incorrect Password"})
                }
            } else {
                res.json({"status":"Invalid Email ID"})
            }
        }
    ).catch()
})


// signUp
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