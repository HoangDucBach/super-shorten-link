import { DynamicModule, Module } from '@nestjs/common';
import { CreateUserUseCases } from 'src/applications/use-cases/createUser.usecase';
import { GetAllUserUseCases } from 'src/applications/use-cases/getAllUsers.usecase';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { RepositoriesModule } from '../repositories/repositories.module';
import { UserRepositoryOrm } from '../repositories/user.repository';
import { UseCaseProxy } from './usecase-proxy';
import { ShortLinkRepositoryOrm } from '../repositories/short-links.repository';
import { WriteShortLinkToReadDatabaseUseCases, CreateShortLinkUseCases, GetShortLinkByIdUseCases, GetAllShortLinksFromWriteDatabaseUseCases, GetAllShortLinkFromReadDatabaseUseCases as GetAllShortLinksFromReadDatabaseUseCases, WriteShortLinkToWriteDatabaseUseCases, GetShortLinkByIdFromReadDatabaseUseCases } from 'src/applications/use-cases/short-link.usecase';

@Module({
  imports: [EnvironmentConfigModule, RepositoriesModule],
})
export class UsecaseProxyModule {
  static GET_ALL_USERS_USE_CASE = 'getAllUsersUsecaseProxy';
  static CREATE_USER_USE_CASE = 'createUserUsecaseProxy';

  static CREATE_SHORT_LINK_USE_CASE = 'createShortLinkUsecaseProxy';
  static GET_SHORT_LINK_BY_ID_USE_CASE = 'getShortLinkByIdUsecaseProxy';

  static WRITE_SHORT_LINK_TO_READ_DATABASE_USE_CASE = 'writeShortLinkToReadDatabaseUsecaseProxy';
  static GET_ALL_SHORT_LINKS_FROM_READ_DATABASE_USE_CASE = 'getAllShortLinksFromReadDatabaseUsecaseProxy';
  static GET_SHORT_LINK_BY_ID_FROM_READ_DATABASE_USE_CASE = 'getShortLinkByIdFromReadDatabaseUsecaseProxy';

  static WRITE_SHORT_LINK_TO_WRITE_DATABASE_USE_CASE = 'writeShortLinkToWriteDatabaseUsecaseProxy';
  static GET_ALL_SHORT_LINKS_FROM_WRITE_DATABASE_USE_CASE = 'getAllShortLinksFromWriteDatabaseUsecaseProxy';
  static GET_SHORT_LINK_BY_ID_FROM_WRITE_DATABASE_USE_CASE = 'getShortLinkByIdFromWriteDatabaseUsecaseProxy';

  static register(): DynamicModule {
    return {
      module: UsecaseProxyModule,
      providers: [
        // === User Use Cases ===
        {
          inject: [UserRepositoryOrm],
          provide: UsecaseProxyModule.GET_ALL_USERS_USE_CASE,
          useFactory: (userRepository: UserRepositoryOrm) =>
            new UseCaseProxy(new GetAllUserUseCases(userRepository)),
        },
        {
          inject: [UserRepositoryOrm],
          provide: UsecaseProxyModule.CREATE_USER_USE_CASE,
          useFactory: (userRepository: UserRepositoryOrm) =>
            new UseCaseProxy(new CreateUserUseCases(userRepository)),
        },

        // === Short Link Use Cases ===
        {
          inject: [ShortLinkRepositoryOrm],
          provide: UsecaseProxyModule.CREATE_SHORT_LINK_USE_CASE,
          useFactory: (shortLinkRepository: ShortLinkRepositoryOrm) =>
            new UseCaseProxy(new CreateShortLinkUseCases(shortLinkRepository)),
        },
        {
          inject: [ShortLinkRepositoryOrm],
          provide: UsecaseProxyModule.GET_SHORT_LINK_BY_ID_USE_CASE,
          useFactory: (shortLinkRepository: ShortLinkRepositoryOrm) =>
            new UseCaseProxy(new GetShortLinkByIdUseCases(shortLinkRepository)),
        },
        {
          inject: [ShortLinkRepositoryOrm],
          provide: UsecaseProxyModule.WRITE_SHORT_LINK_TO_READ_DATABASE_USE_CASE,
          useFactory: (shortLinkRepository: ShortLinkRepositoryOrm) =>
            new UseCaseProxy(new WriteShortLinkToReadDatabaseUseCases(shortLinkRepository)),
        },
        {
          inject: [ShortLinkRepositoryOrm],
          provide: UsecaseProxyModule.GET_ALL_SHORT_LINKS_FROM_READ_DATABASE_USE_CASE,
          useFactory: (shortLinkRepository: ShortLinkRepositoryOrm) =>
            new UseCaseProxy(new GetAllShortLinksFromReadDatabaseUseCases(shortLinkRepository)),
        },
        {
          inject: [ShortLinkRepositoryOrm],
          provide: UsecaseProxyModule.GET_SHORT_LINK_BY_ID_FROM_READ_DATABASE_USE_CASE,
          useFactory: (shortLinkRepository: ShortLinkRepositoryOrm) =>
            new UseCaseProxy(new GetShortLinkByIdFromReadDatabaseUseCases(shortLinkRepository)),
        },
        {
          inject: [ShortLinkRepositoryOrm],
          provide: UsecaseProxyModule.WRITE_SHORT_LINK_TO_WRITE_DATABASE_USE_CASE,
          useFactory: (shortLinkRepository: ShortLinkRepositoryOrm) =>
            new UseCaseProxy(new WriteShortLinkToWriteDatabaseUseCases(shortLinkRepository)),
        },
        {
          inject: [ShortLinkRepositoryOrm],
          provide: UsecaseProxyModule.GET_ALL_SHORT_LINKS_FROM_WRITE_DATABASE_USE_CASE,
          useFactory: (shortLinkRepository: ShortLinkRepositoryOrm) =>
            new UseCaseProxy(new GetAllShortLinksFromWriteDatabaseUseCases(shortLinkRepository)),
        },
        {
          inject: [ShortLinkRepositoryOrm],
          provide: UsecaseProxyModule.GET_SHORT_LINK_BY_ID_FROM_WRITE_DATABASE_USE_CASE,
          useFactory: (shortLinkRepository: ShortLinkRepositoryOrm) =>
            new UseCaseProxy(new GetShortLinkByIdFromReadDatabaseUseCases(shortLinkRepository)),
        },
      ],
      exports: [
        UsecaseProxyModule.GET_ALL_USERS_USE_CASE,
        UsecaseProxyModule.CREATE_USER_USE_CASE,
        UsecaseProxyModule.CREATE_SHORT_LINK_USE_CASE,
        UsecaseProxyModule.WRITE_SHORT_LINK_TO_READ_DATABASE_USE_CASE,
        UsecaseProxyModule.GET_ALL_SHORT_LINKS_FROM_READ_DATABASE_USE_CASE,
        UsecaseProxyModule.GET_SHORT_LINK_BY_ID_FROM_READ_DATABASE_USE_CASE,
        UsecaseProxyModule.GET_SHORT_LINK_BY_ID_USE_CASE,
        UsecaseProxyModule.WRITE_SHORT_LINK_TO_WRITE_DATABASE_USE_CASE,
        UsecaseProxyModule.GET_ALL_SHORT_LINKS_FROM_WRITE_DATABASE_USE_CASE,
        UsecaseProxyModule.GET_SHORT_LINK_BY_ID_FROM_WRITE_DATABASE_USE_CASE,
      ],
    };
  }
}
