import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShortLinkForReadM, ShortLinkM } from 'src/domains/model/short-link';
import { ShortLinkRepository } from 'src/domains/repositories/short-link.repository';
import { ShortLink, ShortLinkForRead } from '../entities/short-link.entity';
import { CreateShortLinkDto, CreateShortLinkForReadDto } from 'src/presentations/short-link/dto/create-short-link.dto';
import { ShortIdGenService } from 'src/short-id-gen/short-id-gen.service';
import { DatabaseStreamType } from 'src/domains/config/database.interface';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class ShortLinkRepositoryOrm implements ShortLinkRepository {
    constructor(
        @InjectRepository(ShortLink, DatabaseStreamType.WRITE)
        private readonly writeShortLinkRepository: Repository<ShortLink>,

        @InjectRepository(ShortLinkForRead, DatabaseStreamType.READ)
        private readonly readShortLinkRepository: Repository<ShortLinkForRead>,

        @Inject(ShortIdGenService)
        private readonly shortIdGenService: ShortIdGenService,
        @Inject(CacheService)
        private readonly cacheService: CacheService,
    ) { }

    writeShortLinkToReadDatabase(shortLink: CreateShortLinkForReadDto): Promise<ShortLinkForReadM> {

        const { longUrl, shortId } = shortLink;
        const shortLinkForRead = new ShortLinkForRead();
        shortLinkForRead.longUrl = longUrl;
        shortLinkForRead.shortId = shortId;
        return this.readShortLinkRepository.save(shortLinkForRead);
    }

    getShortLinkByIdFromReadDatabase(shortId: string): Promise<ShortLinkForReadM | null> {
        return this.readShortLinkRepository.findOne({
            where: { shortId: shortId }
        });
    }

    writeShortLinkToWriteDatabase(shortLink: ShortLinkM): Promise<ShortLinkM> {
        const { longUrl, shortId } = shortLink;
        const shortLinkForWrite = new ShortLink();
        shortLinkForWrite.longUrl = longUrl;
        shortLinkForWrite.shortId = shortId;
        return this.writeShortLinkRepository.save(shortLinkForWrite);
    }

    getAllShortLinkFromWriteDatabase(): Promise<ShortLinkM[]> {
        return this.writeShortLinkRepository.find();
    }

    getShortLinkByIdFromWriteDatabase(shortId: string): Promise<ShortLinkM | null> {
        return this.writeShortLinkRepository.findOne({
            where: { shortId: shortId }
        });
    }

    async getAllShortLinkFromReadDatabase(): Promise<ShortLinkForReadM[]> {
        const shortLinks = await this.readShortLinkRepository.find();
        return shortLinks;
    }



    async createShortLink(createShortLinkDto: CreateShortLinkDto): Promise<ShortLinkM> {
        const shortLink = new ShortLink();
        shortLink.shortId = await this.shortIdGenService.generateShortId();
        shortLink.longUrl = createShortLinkDto.longUrl;
        shortLink.createdAt = new Date();
        return await this.writeShortLinkRepository.save(shortLink);
        console.log('Saved mapping:', shortLink.longUrl);
        this.cacheService.setUrl(shortLink.shortId, shortLink.longUrl);
    }

    async getShortLinkById(shortId: string): Promise<ShortLinkForReadM | null> {

        console.log('Fetching short link by ID:', shortId)
        const cacheData = await this.cacheService.getUrl((shortId))
        console.log('Cache data:', cacheData);
        if (cacheData) {
            const shortLink = new ShortLinkM();
            shortLink.shortId = shortId;
            shortLink.longUrl = cacheData;
            shortLink.createdAt = new Date();  
            console.log('Cache hit:', shortLink);
            return shortLink;
        }

        const shortLink = await this.readShortLinkRepository.findOne({
            where: { shortId: shortId }
        });

        return shortLink;
    }

}