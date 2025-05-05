import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigModule } from '../config/typeorm/typeorm.module';
import { User } from '../entities/user.entity';
import { UserRepositoryOrm } from './user.repository';
import { ShortLinkRepositoryOrm } from './short-links.repository';
import { ShortLink, ShortLinkForRead } from '../entities/short-link.entity';
import { ShortIdGenModule } from 'src/short-id-gen/short-id-gen.module';
import { DatabaseStreamType } from 'src/domains/config/database.interface';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([User, ShortLink], DatabaseStreamType.WRITE),
    TypeOrmModule.forFeature([User, ShortLink, ShortLinkForRead], DatabaseStreamType.READ),
    ShortIdGenModule],
  providers: [UserRepositoryOrm, ShortLinkRepositoryOrm],
  exports: [UserRepositoryOrm, ShortLinkRepositoryOrm],
})
export class RepositoriesModule { }
