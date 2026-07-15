const Mongoose=require("mongoose")
const userModel = require("./users")

const postSchema= Mongoose.Schema(
    {
        userId : {
            type: Mongoose.Schema.Types.ObjectId ,
            ref:"users"
        },

        Message:String,

        postedDate : {
            type:Date,
            default:Date.now
        }
    }
)

var postModel = Mongoose.model("posts",postSchema)
module.exports=postModel