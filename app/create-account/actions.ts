"use server"
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEXP, PASSWORD_REGEX_ERROR } from "@/lib/contants";
import db from "@/lib/db";
import { z } from "zod";
import * as bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";


const checkUniqueUsername = async (username: string) => {
    const user = await db.user.findUnique({
        where: {
            username
        },
        select: {
            id: true
        }
    });

    return !Boolean(user);
}

// const checkUniqueEmail = async (email: string) => {
//     const userEmail = await db.user.findUnique({
//         where: {
//             email
//         },
//         select: {
//             id: true
//         }
//     });

//     return !Boolean(userEmail);
// }

const usernameRegexp = new RegExp(/^[a-zA-Zㄱ-ㅎ가-힣]*$/); // 영문자, 한글만 허용 


const checkPassword = ({ password, confirm_password }: { password: string, confirm_password: string }) => password === confirm_password;
const formSchema = z.object({
    username: z.string(
        {
            invalid_type_error: "한글로 입력해주세요",
            required_error: "이름을 입력해주세요"
        }
    )
        .trim().toLowerCase().regex(usernameRegexp, "숫자 또는 특수문자를 입력할 수 없습니다.").refine(checkUniqueUsername, "중복되는 닉네임이 존재합니다."),
    email: z.string().email().toLowerCase(),
    password: z.string().min(PASSWORD_MIN_LENGTH, `${PASSWORD_MIN_LENGTH}자 이상 입력해주세요`).regex(PASSWORD_REGEXP, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH, `${PASSWORD_MIN_LENGTH}자 이상 입력해주세요`),
})
    .superRefine(async ({ username }, ctx) => {
        const user = await db.user.findUnique({
            where: { username },
            select: { id: true }
        });
        if (user) {
            ctx.addIssue({
                code: 'custom',
                message: "중복되는 닉네임이 존재합니다.",
                path: ["username"],
                fatal: true

            })
            return z.NEVER;
        }
    }).superRefine(async ({ email }, ctx) => {
        const user = await db.user.findUnique({
            where: { email },
            select: { id: true }
        });
        if (user) {
            ctx.addIssue({
                code: 'custom',
                message: "이미 가입된 이메일 입니다.",
                path: ["email"],
                fatal: true

            })
            return z.NEVER;
        }
    }).refine(checkPassword, { message: "비밀번호와 비밀번호 확인이 일치하지 않습니다.", path: ["confirm_password"] });

export async function createAccount(prevState: any, formData: FormData) {
    console.log("CREATE ACCOUNT");
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password"),
    }

    // validation 
    const result = await formSchema.safeParseAsync(data);
    console.log(result);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (!result.success) {
        // Error 
        return result.error.flatten();
    } else {
        console.log(result.data);
        const hashedPassword = await bcrypt.hashSync(result.data.password, 10);

        const user = await db.user.create({
            data: {
                username: result.data.username,
                email: result.data.email,
                password: hashedPassword,
            },
            select: {
                id: true
            }
        });

        const session = await getSession();
        session.id = user.id;

        await session.save();
        // console.log({ user });
        redirect("/profile")

    }


}  