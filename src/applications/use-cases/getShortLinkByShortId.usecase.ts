import { ShortLinkM } from 'src/domains/model/short-link';
import { ShortLinkRepository } from 'src/domains/repositories/short-link.repository';

export class GetShortLinkByIdUseCases {
    constructor(private shortLinkReposity: ShortLinkRepository) { }

    async execute(shortId: string): Promise<ShortLinkM | null> {
        return await this.shortLinkReposity.getShortLinkById(shortId);
    }
}