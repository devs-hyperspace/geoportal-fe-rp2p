import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Kabkot {
    id: string;
    name: string;
}

interface Group {
    id: string;
    name: string;
    kabkotId: string;
}

interface Role {
    name: string;
}

interface User {
    username:string;
    name:string;
    password:string;    
    kabkotId?:string;    
    groupId?:string;      
    roleId:number;  
    geonodeUid:number;
    geonodeAccessToken:string;
}

async function seed() {
    const roles: Role[] = [];
    const kabkot: Kabkot[] = [];
    const groups: Group[] = [];
    const users: User[] = [];

    fs.createReadStream('public/data/role.csv')
        .pipe(csv())
        .on('data', (row: any) => {
            // Type cast to match User interface
            roles.push({
                name: row.name,
            });
        })
        .on('end', async () => {
            try {
                // Insert the users into the database
                await prisma.role.createMany({
                    data: roles,
                    skipDuplicates: true, // Avoid duplicates if needed
                });
            } catch (error) {
                console.error('Error seeding:', error);
            } finally {
                await prisma.$disconnect();
            }
        });


    fs.createReadStream('public/data/kabkot.csv')
        .pipe(csv())
        .on('data', (row: any) => {
            // Type cast to match User interface
            kabkot.push({
                id: row.kabkot_id,
                name: row.kabkot,
            });
        })
        .on('end', async () => {
            try {
                // Insert the users into the database
                await prisma.kabkot.createMany({
                    data: kabkot,
                    skipDuplicates: true, // Avoid duplicates if needed
                });

                fs.createReadStream('public/data/group.csv')
                    .pipe(csv())
                    .on('data', (row: any) => {
                        // Type cast to match User interface
                        groups.push({
                            id: row.id,
                            name: row.name,
                            kabkotId: row.kabkot_id,
                        });
                    })
                    .on('end', async () => {
                        try {
                            // Insert the users into the database
                            await prisma.group.createMany({
                                data: groups,
                                skipDuplicates: true, // Avoid duplicates if needed
                            });
                        } catch (error) {
                            console.error('Error seeding:', error);
                        } finally {
                            await prisma.$disconnect();
                        }
                    });

                fs.createReadStream('public/data/user.csv')
                .pipe(csv())
                .on('data', (row: any) => {
                    const user: User = {
                        username: row.username,
                        name: row.name,
                        password: row.password,
                        roleId: parseInt(row.roleId),
                        geonodeUid: parseInt(row.geonodeUid),
                        geonodeAccessToken: row.geonodeAccessToken,
                    };

                    if (row.kabkotId) {
                        user.kabkotId = row.kabkotId.toString();
                    }
            
                    if (row.groupId) {
                        user.groupId = row.groupId;
                    }
            
                    users.push(user);
                })
                .on('end', async () => {
                    try {
                        // Insert the users into the database
                        await prisma.user.createMany({
                            data: users,
                            skipDuplicates: true, // Avoid duplicates if needed
                        });
                    } catch (error) {
                        console.error('Error seeding:', error);
                    } finally {
                        await prisma.$disconnect();
                    }
                });
            } catch (error) {
                console.error('Error seeding:', error);
            } finally {
                await prisma.$disconnect();
            }
        });
}

seed();
