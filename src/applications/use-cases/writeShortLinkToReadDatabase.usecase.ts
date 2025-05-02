import { ShortLinkForReadM, ShortLinkM } from 'src/domains/model/short-link';
import { ShortLinkRepository } from 'src/domains/repositories/short-link.repository';
import { CreateShortLinkForReadDto } from 'src/presentations/short-link/dto/create-short-link.dto';

export class WriteShortLinkToReadDatabaseUseCases {
    constructor(private shortLinkReposity: ShortLinkRepository) { }

    async execute(createShortLinkForReadDto: CreateShortLinkForReadDto): Promise<ShortLinkForReadM | null> {
        return await this.shortLinkReposity.writeShortLinkToReadDatabase(createShortLinkForReadDto);
    }
}