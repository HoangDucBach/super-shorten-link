import { DynamicModule, Module } from '@nestjs/common';
import { CreateUserUseCases } from 'src/applications/use-cases/createUser.usecase';
import { GetAllUserUseCases } from 'src/applications/use-cases/getAllUsers.usecase';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { RepositoriesModule } from '../repositories/repositories.module';
import { UserRepositoryOrm } from '../repositories/user.repository';
import { UseCaseProxy } from './usecase-proxy';
import { ShortLinkRepositoryOrm } from '../repositories/short-links.repository';
import { GetAllShortLinkUseCases } from 'src/applications/use-cases/getAllShortLinks.usecase';
import { CreateShortLinkUseCases } from 'src/applications/use-cases/createShortLink.usecase';
import { GetShortLinkByIdUseCases } from 'src/applications/use-cases/getShortLinkByShortId.usecase';

@Module({
  imports: [EnvironmentConfigModule, RepositoriesModule],
})
export class UsecaseProxyModule {
  static GET_ALL_USERS_USE_CASE = 'getAllUsersUsecaseProxy';
  static CREATE_USER_USE_CASE = 'createUserUsecaseProxy';

  static GET_ALL_SHORT_LINKS_USE_CASE = 'getAllShortLinksUsecaseProxy';
  static CREATE_SHORT_LINK_USE_CASE = 'createShortLinkUsecaseProxy';
  static GET_SHORT_LINK_USE_CASE = 'getShortLinkUsecaseProxy';
  static GET_SHORT_LINK_BY_ID_USE_CASE = 'getShortLinkByIdUsecaseProxy';

  static register(): DynamicModule {
    return {
      module: UsecaseProxyModule,
      providers: [
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
        {
          inject: [ShortLinkRepositoryOrm],
          provide: UsecaseProxyModule.GET_ALL_SHORT_LINKS_USE_CASE,
          useFactory: (shortLinkRepository: ShortLinkRepositoryOrm) =>
            new UseCaseProxy(new GetAllShortLinkUseCases(shortLinkRepository)),
        },
        {
          inject: [ShortLinkRepositoryOrm],
          provide: UsecaseProxyModule.CREATE_SHORT_LINK_USE_CASE,
          useFactory: (shortLinkRepository: ShortLinkRepositoryOrm) =>
            new UseCaseProxy(new CreateShortLinkUseCases(shortLinkRepository)),
        },
        {
          inject: [ShortLinkRepositoryOrm],
          provide: UsecaseProxyModule.GET_SHORT_LINK_USE_CASE,
          useFactory: (shortLinkRepository: ShortLinkRepositoryOrm) =>
            new UseCaseProxy(new GetAllShortLinkUseCases(shortLinkRepository)),
        },
        {
          inject: [ShortLinkRepositoryOrm],
          provide: UsecaseProxyModule.GET_SHORT_LINK_BY_ID_USE_CASE,
          useFactory: (shortLinkRepository: ShortLinkRepositoryOrm) =>
            new UseCaseProxy(new GetShortLinkByIdUseCases(shortLinkRepository)),
        }
      ],
      exports: [
        UsecaseProxyModule.GET_ALL_USERS_USE_CASE,
        UsecaseProxyModule.CREATE_USER_USE_CASE,
        UsecaseProxyModule.GET_ALL_SHORT_LINKS_USE_CASE,
        UsecaseProxyModule.CREATE_SHORT_LINK_USE_CASE,
        UsecaseProxyModule.GET_SHORT_LINK_USE_CASE,
        UsecaseProxyModule.GET_SHORT_LINK_BY_ID_USE_CASE,
      ],
    };
  }
}
