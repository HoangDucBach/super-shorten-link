import { ShortLinkM } from 'src/domains/model/short-link';
import { ShortLinkRepository } from 'src/domains/repositories/short-link.repository';

export class GetAllShortLinkUseCases {
    constructor(private shortLinkReposity: ShortLinkRepository) { }

    async execute(): Promise<ShortLinkM[]> {
        return await this.shortLinkReposity.getAllShortLink();
    }
}