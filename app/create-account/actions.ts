"use server"
import { z } from "zod";

const checkUsername = (username: string) => {
    return true;
}

const checkPassword = ({ password, confirm_password }: { password: string, confirm_password: string }) => password === confirm_password;
const formSchema = z.object({
    username: z.string(
        {
            invalid_type_error: "한글로 입력해주세요",
            required_error: "이름을 입력해주세요"
        }
    ).min(3, "3자 이상 입력해주세요").max(10, "10자 이상 입력해주세요").refine(checkUsername, "invalid username"),
    email: z.string().email(),
    password: z.string().min(8, "8자 이상 입력해주세요"),
    confirm_password: z.string().min(8, "8자 이상 입력해주세요"),
}).refine(checkPassword, { message: "비밀번호와 비밀번호 확인이 일치하지 않습니다.", path: ["confirm_password"] });

export async function createAccount(prevState: any, formData: FormData) {
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password"),
    }

    // validation
    const result = formSchema.safeParse(data);
    // console.log(result);
    if (!result.success) {
        // Error 
        return result.error.flatten();
    }


}  