import passport from "passport";
import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import { GraphQLLocalStrategy } from "graphql-passport";

export const configurePassport=async ()=>{
    passport.serializeUser((user,done)=>{
        done(null,user.id)
    })

    passport.deserializeUser(async (id,done)=>{
        console.log("Deserializing the user");
        console.log("deserializing  id " , id)
        try{
            const user=await User.findById(id);
            done(null,user)

        }catch (e){
            done(e)
        }

    })

    passport.use(
        new GraphQLLocalStrategy(async (username,password,done)=>{
            try{
                const user=await  User.findOne({username});
                if(!user){
                    throw new Error("Invalid username or password")
                }
                const validPassword=bcrypt.compare(password,user.password)
                if(!validPassword){
                    throw new Error("Invalid username or password")
                }
                return done(null,user)
            }catch (err){
                return done(err)
            }
        })
    )
}