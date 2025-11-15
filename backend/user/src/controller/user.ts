import { redisClient } from "../index.js";
import { publishToQueue } from "../config/rabbitms.js";
import tryCatch from "../config/tryCatch.js";
import { User } from "../model/user.js";
import { generateToken } from "../config/generateToken.js";
import { type AuthenticatedRequest } from "../middleware/isAuth.js";

export const loginUser = tryCatch(async (req, res) => {
    const { email } = req.body;

    const rateLimitKey = `otp:ratelimit:${email}`;

    const rateLimit = await redisClient.get(rateLimitKey);
    console.log(rateLimit, " rate limit");
    if (rateLimit) {
        res.status(429).json({
            message: "Too many requests, please try again later"
        });
        return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpKey = `otp:${email}`;
    await redisClient.set(otpKey, otp, { EX: 300 });
    await redisClient.set(rateLimitKey, "true", { EX: 60 });

    const message = {
        to: email,
        subject: "OTP for Login",
        text: `Your OTP for login is ${otp}. Your OTP is valid for 5 minutes.`,
    };

    await publishToQueue("send-otp", message);

    res.status(200).json({
        message: "OTP sent successfully to your email."
    })
});

export const verifyUser = tryCatch(async (req, res) => {
    const { email, otp: enteredOtp } = req.body;

    if (!email || !enteredOtp) {
        res.status(400).json({
            message: "Email and OTP are required"
        });
        return;
    }

    const otpKey = `otp:${email}`;
    const storedOtp = await redisClient.get(otpKey);

    if (!storedOtp || storedOtp !== enteredOtp) {
        res.status(400).json({
            message: "Invalid OTP"
        });
        return;
    }

    await redisClient.del(otpKey);

    let user = await User.findOne({ email });

    if (!user) {
        let name = email.slice(0, 8)
        user = await User.create({ email, name })
    }

    const token = generateToken(user);

    res.status(200).json({
        message: "User verified successfully.",
        token,
        user
    })
})

export const myProfile = tryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    res.status(200).json({
        message: "User profile fetched successfully.",
        user
    })
})

export const updateName = tryCatch(async (req: AuthenticatedRequest, res) => {
    const { name } = req.body;
    const user = req.user;

    if (!name) {
        res.status(400).json({
            message: "Name is required."
        })
        return;
    }

    const updatedUser = await User.findByIdAndUpdate(user?._id, { name }, { new: true });
    const token = generateToken(updatedUser);

    res.send(201).json({
        message: "User name updated successfully.",
        token,
        user: updatedUser
    });
});

export const getAllUser = tryCatch(async (req: AuthenticatedRequest, res) => {
    const users = await User.find();
    res.status(200).json({
        users
    })
});

export const getAUser = tryCatch(async (req: AuthenticatedRequest, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    console.log(user, "user")
    res.status(200).json({
        user
    })
})