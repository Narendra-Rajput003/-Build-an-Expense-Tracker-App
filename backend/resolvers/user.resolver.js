import {users} from "../dummyData/data.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const userResolver={
    Query:{
       authUser:async (_,__,context)=>{
           try{
               const user=await context.getUser();
               return user;
           }catch (err){
               console.log(err);
               throw new Error(err.message);
           }
       },
        user:async (_,{userId})=>{
           try{
               const user=await User.findById(userId);
               return user;
           }catch (e){
               throw new Error(err.message);
           }
        }

    },
    Mutation: {
        signUp:async(_,{input},context)=>{
              try{

                  const {username,name , password , gender} = input;
                  if(!username || !name || !password || !gender){
                      throw new Error("All fields are required")
                  }
                  const exitingUser=await User.findOne({username});
                  if(exitingUser){
                      throw new Error("User already exists")
                  }
                  const salt=await  bcrypt.genSalt(10);
                  const hashPassword=await  bcrypt.hash(password,salt);

                  const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
                  const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

                  const newUser=new User({
                      username,
                      name,
                      password:hashPassword,
                      gender,
                      profilePicture:gender==="male" ? boyProfilePic : girlProfilePic,
                  })
                  await newUser.save();
                  await  context.login(newUser);
                  return newUser;
              }catch (err){
                  console.log(err);
                  throw  new Error(err.message || "Error in SignUp")
              }
        },
        login:async (_,{input},context)=>{
            try{
                const {username,password} = input;
                if(!username || !password){
                    throw  new Error("All fields are required")
                }
               const {user} = await context.authenticate("graphql-local",{username,password})
                console.log("user",user)
                await context.login(user);

                return user;

            }catch (err){
                console.log(err);
                throw  new Error(err.message || "Error in Login")
            }
        },
        logout:async (_,__,context)=>{
            try{
                await context.logout();
                context.req.session.destroy((err)=>{
                    if (err) throw err;
                });;
                 context.res.clearCookie("connect.sid");

                return {
                    message:"Logged out Successfully"
                }
            }catch (err){
                console.log(err);
                throw new Error(err.message || "Error in Logout")
            }
        }
    }
}
export default  userResolver;