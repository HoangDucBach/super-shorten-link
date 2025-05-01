import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShortLinkM } from 'src/domains/model/short-link';
import { ShortLinkRepository } from 'src/domains/repositories/short-link.repository';
import { ShortLink } from '../entities/short-link.entity';
import { CreateShortLinkDto } from 'src/presentations/short-link/dto/create-short-link.dto';

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
        shortLink.shortId = createShortLinkDto.shortId;
        shortLink.longUrl = createShortLinkDto.longUrl;
        const savedMapping = await this.ShortLinkRepository.save(shortLink);
        return this.toShortLink(savedMapping);
    }

    async getShortLinkById(shortId: string): Promise<ShortLinkM | null> {
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