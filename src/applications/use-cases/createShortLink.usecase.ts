import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseStreamType } from 'src/domains/config/database.interface';
import { ShortLinkM } from 'src/domains/model/short-link';
import { ShortLinkRepository } from 'src/domains/repositories/short-link.repository';
import { ShortLink } from 'src/infrastructures/entities/short-link.entity';
import { CreateShortLinkDto } from 'src/presentations/short-link/dto/create-short-link.dto';

export class CreateShortLinkUseCases {
    constructor(
        private shortLinkReposity: ShortLinkRepository
    ) { }

    async execute(createShortLinkDto: CreateShortLinkDto): Promise<ShortLinkM> {
        return await this.shortLinkReposity.createShortLink(createShortLinkDto);
    }
}