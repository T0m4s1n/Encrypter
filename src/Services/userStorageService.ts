import { promises as fs } from 'fs';
import path from 'path';

class UserStorageService {
    private readonly storagePath: string;
    private readonly usersFile: string;

    constructor() {
        this.storagePath = path.join(process.cwd(), 'storage');
        this.usersFile = path.join(this.storagePath, 'users.json');
        this.initStorage();
    }

    private async initStorage(): Promise<void> {
        try {
            await fs.mkdir(this.storagePath, { recursive: true });
            await fs.writeFile(this.usersFile, JSON.stringify([], null, 2), { flag: 'wx' });
        } catch (error) {
            if (error.code !== 'EEXIST') {
                console.error('Error initializing storage:', error);
                throw new Error('Failed to initialize storage');
            }
        }
    }

    async saveUser(user: User): Promise<void> {
        try {
            const users = await this.getAllUsers();
            users.push(user);
            await fs.writeFile(this.usersFile, JSON.stringify(users, null, 2));
        } catch (error) {
            console.error('Error saving user:', error);
            throw new Error('Failed to save user');
        }
    }

    async getAllUsers(): Promise<User[]> {
        try {
            const data = await fs.readFile(this.usersFile, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading users:', error);
            return [];
        }
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const users = await this.getAllUsers();
        return users.find(user => user.email === email) || null;
    }

    async updateUser(email: string, userData: Partial<User>): Promise<void> {
        const users = await this.getAllUsers();
        const userIndex = users.findIndex(user => user.email === email);

        if (userIndex === -1) {
            throw new Error('User not found');
        }

        users[userIndex] = { ...users[userIndex], ...userData };
        await fs.writeFile(this.usersFile, JSON.stringify(users, null, 2));
    }
}
