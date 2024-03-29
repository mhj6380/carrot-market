"use server"

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import crypto from "crypto";
import getSession from "@/lib/session";
import twilio from "twilio";

const phoneSchema = z.string().trim().refine((phone) => validator.isMobilePhone(phone, "ko-KR"), "휴대폰번호를 올바른 형식으로 입력해주세요.");

async function tokenExists(token: number) {
    const exists = await db.sMSToken.findUnique({
        where: {
            token: token.toString(),
        }, select: {
            id: true
        }
    });

    return Boolean(exists);
}

const tokenSchema = z.coerce.number().min(100000).max(999999).refine(tokenExists, "토큰 정보가 유효하지 않습니다.");

export interface IActionState {
    token: boolean;

}

async function getToken() {
    const token = crypto.randomInt(100000, 999999).toString();
    const exists = await db.sMSToken.findUnique({
        where: {
            token
        }, select: {
            id: true
        }
    });
    if (exists) {
        return getToken();
    } else {
        return token;
    }
}

export async function smsLogin(prevState: IActionState, formData: FormData) {
    const phone = formData.get("phone");
    const token = formData.get("token");

    try {
        if (!prevState.token) {
            const result = phoneSchema.safeParse(phone);
            if (!result.success) {
                return {
                    token: false,
                    errors: result.error.flatten()
                }

            } else {
                // delete previus token 
                await db.sMSToken.deleteMany({
                    where: {
                        user: {
                            phone: result.data
                        }
                    }
                })
                // create token
                const token = await getToken();
                await db.sMSToken.create({
                    data: {
                        token,
                        user: {
                            connectOrCreate: {
                                where: {
                                    phone: result.data
                                },
                                create: {
                                    username: crypto.randomBytes(10).toString("hex"),
                                    phone: result.data
                                }
                            },

                        }
                    }
                })
                // send the token using twillo 
                const client = twilio(
                    process.env.TWILIO_ACCOUNT_SID,
                    process.env.TWILIO_AUTH_TOKEN
                );

                // SMS 인증 
                const smsResult = await client.messages.create({
                    body: `인증번호 입니다. ${token}`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: result.data
                });


                // if (smsResult.errors) {

                // }
                // console.log("smsResult"); 
                console.log({ smsResult });

                return smsResult;

            }
        } else {
            const result = await tokenSchema.spa(token);
            if (!result.success) {
                return {
                    token: true,
                    errors: result.error.flatten()
                }
            } else {
                const token = await db.sMSToken.findUnique({
                    where: {
                        token: result.data.toString()
                    }, select: {
                        id: true,
                        userId: true
                    }
                });

                if (token) {
                    const session = await getSession();
                    session.id = token.userId;
                    await session.save();
                    await db.sMSToken.delete({
                        where: {
                            id: token.id
                        }
                    })
                }
                // 로그인 성공 
                redirect("/profile")
            }
        }


    } catch (e: any) {
        return {
            token: false,
            errors: { formErrors: [`${e.message}`], fieldErrors: {} }
        };
    }

}    