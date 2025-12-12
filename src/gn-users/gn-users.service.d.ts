import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
export declare class GnUsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    getAllUsers(): Promise<User[]>;
    getUsersByGn(gnId: number): Promise<any[]>;
    searchUserByNIC(nic: string): Promise<User | null>;
}
