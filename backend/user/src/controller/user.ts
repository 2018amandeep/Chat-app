import { redisClient } from "../index.js";
import { publishToQueue } from "../config/rabbitms.js";
import tryCatch from "../config/tryCatch.js";

export const loginUser = tryCatch(async (req, res) => {
    const { email } = req.body;

    const rateLimitKey = `otp:ratelimit:${email}`;

    const rateLimit = await redisClient.get(rateLimitKey);
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


})