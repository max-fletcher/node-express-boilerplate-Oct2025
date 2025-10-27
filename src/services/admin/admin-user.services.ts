import { Transaction } from 'sequelize';
import { generateId } from '../../utils/id.utils';
import { StoreAdminUserData, UpdateAdminUserData } from '../../types/admin-user.type';
import { AdminUserRepository } from '../../db/rdb/repositories/admin-user.repository';

export class AdminUserService {
  private appAdminUserRepo: AdminUserRepository;

  constructor() {
    this.appAdminUserRepo = new AdminUserRepository();
  }

  async findAdminUserById(id: string, select: string[]|null = null) {
    return await this.appAdminUserRepo.findAdminUserById(id, select);
  }

  async adminAdminUserExistsById(id: string) {
    return await this.appAdminUserRepo.adminUserExistsById(id);
  }

  async findAdminUserByEmail(email: string) {
    return await this.appAdminUserRepo.findAdminUserByEmail(email);
  }

  async adminAdminUserExistsByEmail(email: string, exceptId: string | null = null) {
    return await this.appAdminUserRepo.adminUserExistsByEmail(email, exceptId);
  }

  async findAdminUserByPhone(phoneNumber: string, exceptId: string | null = null) {
    return await this.appAdminUserRepo.findAdminUserByPhone(phoneNumber, exceptId);
  }

  async adminUserExistsByPhone(phoneNumber: string, exceptId: string | null = null) {
    return await this.appAdminUserRepo.adminUserExistsByPhoneNumber(phoneNumber, exceptId);
  }

  async getAllAdminUsers() {
    return await this.appAdminUserRepo.getAllAdminUsers();
  }

  async getAllAdminUsersWithOptions(select: string[]|null = null) {
    return await this.appAdminUserRepo.getAllAdminUsersWithOptions(select);
  }

  async storeAdminUser(data: StoreAdminUserData, transaction?: Transaction) {
    return await this.appAdminUserRepo.storeAdminUser({ id: generateId(), ...data }, transaction);
  }

  async updateAdminUser(data: UpdateAdminUserData, id: string, transaction?: Transaction) {
    return await this.appAdminUserRepo.updateAdminUser(data, id, transaction);
  }

  // async deleteAdminUser(id: string, deletedBy: string, transaction?: Transaction) {
  //   return await this.appAdminUserRepo.deleteAdminUser(id, deletedBy, transaction);
  // }
}
