import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { User } from '../entities/user.entity';
import { UserRepositoryOrm } from './user.repository';
import { ShortLinkRepositoryOrm } from './short-links.repository';
import { ShortLink } from '../entities/short-link.entity';
import { ShortIdGenModule } from 'src/short-id-gen/short-id-gen.module';

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([User, ShortLink]), ShortIdGenModule],
  providers: [UserRepositoryOrm, ShortLinkRepositoryOrm],
  exports: [UserRepositoryOrm, ShortLinkRepositoryOrm],
})
export class RepositoriesModule { }
