import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// async function createUser() {
//     const result = await db.user.create({
//         data: {
//             username: "hahah",
//         }
//     })
//     console.log(result);
// }

// async function getUsers() {
//     const result = await db.user.findMany({
//         where: {
//             username: {
//                 contains: "haha"
//             }
//         }
//     })
//     console.log(result);
// }


// getUsers();


export default db;
