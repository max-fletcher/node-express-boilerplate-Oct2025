import { Op, Transaction } from 'sequelize';
import { AdminUser, StoreAdminUser, UpdateAdminUserData } from '../../../types/admin-user.type';
import { AdminUserModel } from '../models';

export class AdminUserRepository {
  async findAdminUserByEmail(email: string): Promise<AdminUser> {
    const options: any = {
      where: {
        email: email,
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'password', 'phoneNumber', 'createdAt', 'updatedAt']
    };

    return (await AdminUserModel.findOne(options,)) as unknown as AdminUser;
  }

  async adminUserExistsByEmail(email: string, exceptId: string | null = null): Promise<number> {
    const options: any = {
        where: {
        email: email
      }
    }

    if (exceptId) options.where.id = { [Op.ne]: exceptId };

    return await AdminUserModel.count(options) as unknown as number;
  }

  async findAdminUserByPhone(phone: string, exceptId: string | null = null): Promise<AdminUser> {
    const options: any = {
      where: {
        phone: phone,
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'createdAt', 'updatedAt']
    };

    if (exceptId) options.where.id = { [Op.ne]: exceptId };

    return (await AdminUserModel.findOne(options,)) as unknown as AdminUser;
  }

  async adminUserExistsByPhoneNumber(phoneNumber: string, exceptId: string | null = null): Promise<number> {
    const options: any = {
      where: {
        phoneNumber: phoneNumber,
      }
    }

    if (exceptId) options.where.id = { [Op.ne]: exceptId };

    return await AdminUserModel.count(options) as unknown as number;
  }

  async getAllAdminUsers(): Promise<AdminUser[]> {
    return (await AdminUserModel.findAll({
      attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']]
    })) as unknown as AdminUser[];
  }

  async findAdminUserById(id: string, select: string[]|null = null): Promise<AdminUser> {
    const options: any = {
      where: {
        id: id,
      },
      attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'createdAt', 'updatedAt']
    };

    if(select && select.length > 0)
      options.attributes = select

    return (await AdminUserModel.findOne(options)) as unknown as AdminUser;
  }

  async findAdminUserByIds(ids: string[]): Promise<AdminUser[]> {
      return (await AdminUserModel.findAll({
        where: {
          id: {
            [Op.in]: ids,
            deletedAt:{
              [Op.eq]: null
            } 
          },
        },
        attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'createdAt', 'updatedAt']
      })) as unknown as AdminUser[];
    }
    
  async adminUserExistsById(id: string): Promise<number> {
    return await AdminUserModel.count({
      where: {
        id: id,
      },
    })
  }
    
  async getAllAdminUsersCount(): Promise<number> {
    return await AdminUserModel.count();
  }

  async storeAdminUser(data: StoreAdminUser, transaction?: Transaction): Promise<AdminUser> {
    const options: any = {};

    if(transaction) options.transaction = transaction;

    return await AdminUserModel.create(data, options) as unknown as AdminUser;
  }

  async updateAdminUser(data: UpdateAdminUserData, id: string, transaction?: Transaction): Promise<AdminUser> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await AdminUserModel.update(data, options)) as unknown as AdminUser;
  }

  // # IMPLEMENT LATER
  // async deleteAdminUser(id: string, deletedBy: string, transaction?: Transaction): Promise<AdminUser> {
  //   const options: any = {
  //     where: {
  //       id: id,
  //     },
  //   };

  //   if(transaction) options.transaction = transaction;

  //   return await AdminUserModel.update(options) as unknown as AdminUser;
  // }

  async hardDeleteById(id: string, transaction?: Transaction): Promise<AdminUser> {
    const options: any = {
      where: {
        id: id,
      },
    };

    if(transaction) options.transaction = transaction;

    return (await AdminUserModel.destroy(options) ) as unknown as AdminUser;
  }

  async getAllAdminUsersWithOptions(select: string[]|null = null): Promise<AdminUser[]> {
    const options: any = {};

    if(select && select.length > 0)
      options.attributes = select

    return (await AdminUserModel.findAll(options));
  }
}
