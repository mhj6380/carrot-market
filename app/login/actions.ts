"use server";

export const handleForm = async (prevState: any, formData: FormData) => {
    "use server"
    console.log({ prevState });
    console.log(formData.get("email"), formData.get("password"));
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
        errors: ["wrong password", "password too short"]
    };
}
