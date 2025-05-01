import { ShortLinkM } from 'src/domains/model/short-link';
import { ShortLinkRepository } from 'src/domains/repositories/short-link.repository';
import { CreateShortLinkDto } from 'src/presentations/short-link/dto/create-short-link.dto';

export class CreateShortLinkUseCases {
    constructor(private shortLinkReposity: ShortLinkRepository) { }

    async execute(createShortLinkDto: CreateShortLinkDto): Promise<ShortLinkM> {
        return await this.shortLinkReposity.createShortLink(createShortLinkDto);
    }
}