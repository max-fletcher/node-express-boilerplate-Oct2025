import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AdminAuthenticatedRequest } from '../../types/authenticate.type';
import { NotFoundException } from '../../errors/NotFoundException.error';
import { AdminUserService } from '../../services/admin/admin-user.services';
import { hashPassword } from '../../utils/password.utils';
import { BadRequestException } from '../../errors/BadRequestException.error';

const adminUserService = new AdminUserService();

export async function getAllAdminUsers(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const users = await adminUserService.getAllAdminUsers();

    return res.status(200).json({
      data: {
        message: 'Admin user list fetched successfully!',
        users: users,
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('getAllAdminUsers', error)
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}

export async function getSingleAdminUser(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const AdminUserId = req.params.id
    const user = await adminUserService.findAdminUserById(AdminUserId);

    if(!user)
      throw new NotFoundException('User not found.')
    // # IMPLEMENT LATER
    // if(user.deletedAt)
    //   throw new NotFoundException('User not found.')

    return res.status(200).json({
      data: {
        message: 'Admin user fetched successfully!',
        user: user,
      },
      statusCode: 200,
    });
  } catch (error) {
    // console.log('getSingleAllAdminUser', error)
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}

// export async function createAdmin(req: AdminAuthenticatedRequest, res: Response) {
//   try {
//     const data = { ...req.body, updatedBy: req.user!.id }
//     const response = await adminUserService.storeAdminUser(data);

//     if(response)
//       return res.status(201).json({
//         data: {
//           message: 'Admin created successfully!',
//           admin: response,
//         },
//         statusCode: 201,
//       });

//     throw new CustomException('Something went wrong! Please try again.', 500)
//   } catch (error) {
//     console.log('createAdmin', error)
//     if (error instanceof CustomException) {
//       return res.status(error.statusCode).json({
//         error: {
//           message: error.message,
//         },
//         statusCode: error.statusCode,
//       });
//     }

//     return res.status(500).json({
//       error: {
//         message: 'Something went wrong! Please try again.',
//       },
//       statusCode: 500,
//     });
//   }
// }

export async function updateAdmin(req: AdminAuthenticatedRequest, res: Response) {
  try {
    const adminId = req.params.id
    const admin = await adminUserService.adminAdminUserExistsById(adminId)

    if(!admin)
      throw new NotFoundException('Admin not found.')
    // # IMPLEMENT LATER
    // if(admin.deletedAt)
    //   throw new NotFoundException('Admin not found.')

    let hashedPassword = undefined
    const { password, confirmPassword } = req.body
    if(password && confirmPassword){
      if(password !== confirmPassword)
        throw new BadRequestException('Password and confirm password doesn\'t match.')
      else
        hashedPassword = await hashPassword(password);
    }
    const data = { ...req.body, updatedBy: req.user!.id, password: hashedPassword}
    const response = await adminUserService.updateAdminUser(data, adminId);

    if(response){
      const admin = await adminUserService.findAdminUserById(adminId);
      return res.json({
        data: {
          message: 'Admin user updated successfully!',
          admin: admin,
        },
        statusCode: 200,
      });
    }
    throw new CustomException('Something went wrong! Please try again.', 500)
  } catch (error) {
    // console.log('updateAdmin', error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        statusCode: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      statusCode: 500,
    });
  }
}

// export async function deleteAdmin(req: AdminAuthenticatedRequest, res: Response) {
//   try {
//     const adminId = req.params.id
//     const admin = await adminUserService.findAdminUserById(adminId)
//     if(!admin)
//       throw new NotFoundException('Admin not found.')
//     if(admin.deletedAt)
//       throw new NotFoundException('Admin not found.')

//     const response = await adminUserService.deleteAdminUser(adminId, req.user!.id);

//     if(response){
//       return res.json({
//         data: {
//           message: 'Admin deleted successfully!',
//         },
//         statusCode: 200,
//       });
//     }
//     throw new CustomException('Something went wrong! Please try again.', 500)
//   } catch (error) {
//     console.log('deleteAdmin', error);
//     if (error instanceof CustomException) {
//       return res.status(error.statusCode).json({
//         error: {
//           message: error.message,
//         },
//         statusCode: error.statusCode,
//       });
//     }

//     return res.status(500).json({
//       error: {
//         message: 'Something went wrong! Please try again.',
//       },
//       statusCode: 500,
//     });
//   }
// }
