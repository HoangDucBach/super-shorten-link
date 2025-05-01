import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShortLinkM } from 'src/domains/model/short-link';
// import { ShortLinkRepository } from 'src/domains/repositories/short-link.repository';
import { Repository } from 'typeorm';
import { CreateShortLinkDto } from 'src/presentations/user/dto/create-short-link.dto';
import { ShortLinkRepository } from 'src/domains/repositories/short-link.repository';
import { ShortLink } from '../entities/short-link.entity';

@Injectable()
export class ShortLinkRepositoryOrm implements ShortLinkRepository {
    constructor(
        @InjectRepository(ShortLink)
        private readonly ShortLinkRepository: Repository<ShortLink>,
    ) { }

    async getAllShortLink(): Promise<ShortLinkM[]> {
        const ShortLinks = await this.ShortLinkRepository.find();
        return ShortLinks.map((ShortLink) => this.toShortLink(ShortLink));
    }

    async createShortLink(createShortLinkDto: CreateShortLinkDto): Promise<ShortLinkM> {
        const shortLink = new ShortLink();
        shortLink.short_id = createShortLinkDto.short_id;
        shortLink.long_url = createShortLinkDto.long_url;
        const savedMapping = await this.ShortLinkRepository.save(shortLink);
        return this.toShortLink(savedMapping);
    }

    async findByShortId(shortId: string): Promise<ShortLinkM | null> {
        const ShortLink = await this.ShortLinkRepository.findOne({
            where: { short_id: shortId }
        });

        if (!ShortLink) {
            return null;
        }

        return this.toShortLink(ShortLink);
    }

    private toShortLink(ShortLink: ShortLink): ShortLinkM {
        const shortLink: ShortLinkM = new ShortLinkM();

        shortLink.short_id = ShortLink.short_id;
        shortLink.long_url = ShortLink.long_url;
        shortLink.created_at = ShortLink.created_at;

        return shortLink;
    }
}