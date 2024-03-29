"use server";

// import { PASSWORD_MIN_LENGTH, PASSWORD_REGEXP, PASSWORD_REGEX_ERROR } from "@/lib/contants";
import db from "@/lib/db";
import { z } from "zod";
import * as bcrypt from "bcryptjs";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const checkEmailExists = async (email: string) => {
    const user = await db.user.findUnique({ // 추후 API통신으로 변경하자 
        where: {
            email
        }, select: {
            id: true
        }
    });

    return Boolean(user);
};

const formSchema = z.object({
    email: z.string().toLowerCase().refine(checkEmailExists, "해당 이메일로 가입된 정보가 없습니다."),
    password: z.string({
        required_error: "비밀번호를 입력해주세요."
    })
    // .min(PASSWORD_MIN_LENGTH, `${PASSWORD_MIN_LENGTH}자 이상 입력해주세요.`) 
    // .regex(PASSWORD_REGEXP, PASSWORD_REGEX_ERROR) 
})

export const login = async (prevState: any, formData: FormData) => {
    "use server"

    const data = {
        email: formData.get("email"),
        password: formData.get("password"),
    }

    const result = await formSchema.spa(data);
    console.log(result);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (!result.success) {
        // Error 
        return result.error.flatten();
    } else {
        // find user with email

        // check password
        const user = await db.user.findUnique({
            where: {
                email: result.data.email
            },
            select: {
                id: true,
                password: true
            }
        })
        const ok = bcrypt.compareSync(result.data.password, user!.password ?? "xxxx");
        // throw new BadRequestException("비밀번호가 틀렸습니다."); 

        if (ok) {
            const session = await getSession();
            session.id = user!.id;
            await session.save();
            redirect("/profile")
        } else {
            return {
                fieldErrors: {
                    password: ["Wrong Password."]
                }
            }
        }

        // login
        // redirect "/profile"
    }


}
