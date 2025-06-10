import NextAuth from "next-auth";

declare module "next-auth" {
    interface User{
        username: string,
        name: string,
        roleId:number,
        geonodeUid:number,
        geonodeAccessToken:string,
        kabkot?:{
            id:string,
            name:string
        },
        group?:{
            id:string,
            name:string
        },
    }
    interface Session{
        user: User & {
            username: string,
            name: string,
            roleId:number,
            geonodeUid:number,
            geonodeAccessToken:string,
            kabkot?:{
                id:string,
                name:string
            },
            group?:{
                id:string,
                name:string
            },
        },
        token:{
            username: string,
            name: string,
            roleId:number,
            geonodeUid:number,
            geonodeAccessToken:string,
            kabkot?:{
                id:string,
                name:string
            },
            group?:{
                id:string,
                name:string
            },
        }
    }
}