import { GnUsersService } from './gn-users.service';
export declare class GnUsersController {
    private readonly gnUsersService;
    constructor(gnUsersService: GnUsersService);
    getUsers(gnId?: number): Promise<any[]>;
    searchUser(nic: string): Promise<import("../entities/user.entity").User | {
        error: string;
    } | null>;
}
