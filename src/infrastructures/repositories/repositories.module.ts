import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { User } from '../entities/user.entity';
import { UserRepositoryOrm } from './user.repository';
import { ShortLinkRepositoryOrm } from './short-links.repository';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([User])],
  providers: [UserRepositoryOrm, ShortLinkRepositoryOrm],
  exports: [UserRepositoryOrm, ShortLinkRepositoryOrm],
})
export class RepositoriesModule { }
