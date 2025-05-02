import { Repository } from 'typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShortLinkM } from 'src/domains/model/short-link';
import { ShortLinkRepository } from 'src/domains/repositories/short-link.repository';
import { ShortLink } from '../entities/short-link.entity';
import { CreateShortLinkDto } from 'src/presentations/short-link/dto/create-short-link.dto';
import { ShortIdGenService } from 'src/short-id-gen/short-id-gen.service';
import { DatabaseStreamType } from 'src/domains/config/database.interface';

@Injectable()
export class ShortLinkRepositoryOrm implements ShortLinkRepository {
    constructor(
        @InjectRepository(ShortLink, DatabaseStreamType.WRITE)
        private readonly writeShortLinkRepository: Repository<ShortLink>,

        @InjectRepository(ShortLink, DatabaseStreamType.READ)
        private readonly readShortLinkRepository: Repository<ShortLink>,

        @Inject(ShortIdGenService)
        private readonly shortIdGenService: ShortIdGenService,
    ) { }

    async getAllShortLink(): Promise<ShortLinkM[]> {
        const shortLinks = await this.readShortLinkRepository.find();
        return shortLinks;
    }

    async createShortLink(createShortLinkDto: CreateShortLinkDto): Promise<ShortLinkM> {
        const shortLink = new ShortLink();
        console.log('createShortLinkDto', createShortLinkDto);
        shortLink.shortId = await this.shortIdGenService.generateShortId();
        shortLink.longUrl = createShortLinkDto.longUrl;
        return await this.writeShortLinkRepository.save(shortLink);
    }

    async getShortLinkById(shortId: string): Promise<ShortLinkM | null> {
        const shortLink = await this.readShortLinkRepository.findOne({
            where: { shortId: shortId }
        });
        
        return shortLink;
    }

}