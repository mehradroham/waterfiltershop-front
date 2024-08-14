const userModel = require("../../models/userModels")
const bcrypt = require('bcryptjs');


async function userSignUpController(req,res){
    try{
        const { email, password, name} = req.body

        const user = await userModel.findOne({email})


        if(user){
            throw new Error("شما قبلا با این ایمیل ثبت نام کرده اید")
        }

        if(!email){
           throw new Error("لطفا ایمیل معتبر وارد کنید")
        }
        if(!password){
            throw new Error("گذرواژه خود را وارد کنید")
        }
        if(!name){
            throw new Error("نام خود را وارد کنید")
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = await bcrypt.hashSync(password, salt);

        if(!hashPassword){
            throw new Error("Something is wrong")
        }

        const payload = {
            ...req.body,
            role : "GENERAL",
            password : hashPassword
        }

        const userData = new userModel(payload)
        const saveUser = await userData.save()

        res.status(201).json({
            data : saveUser,
            success : true,
            error : false,
            message : "اکانت شما ساخته شد"
        })


    }catch(err){
        res.json({
            message : err.message || err  ,
            error : true,
            success : false,
        })
    }
}

module.exports = userSignUpController