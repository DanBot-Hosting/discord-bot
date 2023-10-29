import { Request, Response } from "express";

import User from "../../../models/User";
import Verification from "../../../models/Verification";

export default async (req: Request, res: Response) => {
    const id = req.params.id;

    const data = await Verification.findOne({ _id: id });
    const userData = await User.findOne({ _id: data.user });

    if(!data) return res.status(404).render("verify/error", { error: "Invalid ID provided" });

    if(userData?.verified) {
        res.status(400).render("verify/error", { error: "You are already verified" });
        await data.delete();
        return;
    }

    if(!userData) {
        await new User({
            _id: data.user,
            verified: true
        }).save()
    } else {
        userData.verified = true;
        await userData.save();
    }

    await data.delete();

    res.status(200).render("verify/success");
}
