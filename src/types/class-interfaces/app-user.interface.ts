import { TAppUser, TAppUserCreate, TAppUserUpdate, TAppUserWithoutPassword } from "../types/app-user.type";
import { ICommonRepository, ICommonService } from "./common.interface";

// export interface IAppUserControllerInterface extends ICommonController<TAppUser> {};

export interface IAppUserServiceInterface extends ICommonService<TAppUser, TAppUserCreate, TAppUserUpdate, TAppUserWithoutPassword> {};

export interface IAppUserRepositoryInterface extends ICommonRepository<TAppUser, TAppUserCreate, TAppUserUpdate, TAppUserWithoutPassword> {};