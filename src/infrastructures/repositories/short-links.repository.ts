import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShortLinkM } from 'src/domains/model/short-link';
import { ShortLinkRepository } from 'src/domains/repositories/short-link.repository';
import { ShortLink } from '../entities/short-link.entity';
import { CreateShortLinkDto } from 'src/presentations/short-link/dto/create-short-link.dto';
import { ShortIdGenService } from 'src/short-id-gen/short-id-gen.service';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class ShortLinkRepositoryOrm implements ShortLinkRepository {
    constructor(
        @InjectRepository(ShortLink)
        private readonly ShortLinkRepository: Repository<ShortLink>,
        @Inject(ShortIdGenService)
        private readonly shortIdGenService: ShortIdGenService,
        @Inject(CacheService)
        private readonly cacheService: CacheService,
    ) { }

    async getAllShortLink(): Promise<ShortLinkM[]> {

        const ShortLinks = await this.ShortLinkRepository.find();
        return ShortLinks.map((ShortLink) => this.toShortLink(ShortLink));
    }

    async createShortLink(createShortLinkDto: CreateShortLinkDto): Promise<ShortLinkM> {
        const shortLink = new ShortLink();
        shortLink.shortId = createShortLinkDto.shortId || await this.shortIdGenService.generateShortId();
        shortLink.longUrl = createShortLinkDto.longUrl;
        const savedMapping = await this.ShortLinkRepository.save(shortLink);
        console.log('Saved mapping:', shortLink.longUrl);
        this.cacheService.setUrl(shortLink.shortId, shortLink.longUrl);
        return this.toShortLink(savedMapping);
    }

    async getShortLinkById(shortId: string): Promise<ShortLinkM | null> {

        console.log('Fetching short link by ID:', shortId)
        const cacheData = await this.cacheService.getUrl((shortId))
        console.log('Cache data:', cacheData);
        if (cacheData) {
            const shortLink = new ShortLinkM();
            shortLink.shortId = shortId;
            shortLink.longUrl = cacheData;
            shortLink.created_at = new Date();  
            console.log('Cache hit:', shortLink);
            return shortLink;
        }

        const ShortLink = await this.ShortLinkRepository.findOne({
            where: { shortId: shortId }
        });

        if (!ShortLink) {
            return null;
        }

        return this.toShortLink(ShortLink);
    }

    private toShortLink(ShortLink: ShortLink): ShortLinkM {
        const shortLink: ShortLinkM = new ShortLinkM();

        shortLink.shortId = ShortLink.shortId;
        shortLink.longUrl = ShortLink.longUrl;
        shortLink.created_at = ShortLink.created_at;

        return shortLink;
    }
}