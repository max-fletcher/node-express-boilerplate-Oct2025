import { TAppUser, TAppUserCreate, TAppUserUpdate, TAppUserWithoutPassword } from "../types/app-user.type";
import { ICommonController, ICommonRepository, ICommonService } from "./common.interfact";

export interface IAppUserControllerInterface extends ICommonController<TAppUser> {};

export interface IAppUserServiceInterface extends ICommonService<TAppUser, TAppUserCreate, TAppUserUpdate> {};

export interface IAppUserRepositoryInterface extends ICommonRepository<TAppUser, TAppUserCreate, TAppUserUpdate, TAppUserWithoutPassword> {};