import { CreateShortLinkDto } from 'src/presentations/user/dto/create-short-link.dto';
import { ShortLinkM } from '../model/short-link';

export interface ShortLinkRepository {
    getAllShortLink(): Promise<ShortLinkM[]>;
    createShortLink(createShortLinkDto: CreateShortLinkDto): Promise<ShortLinkM>;
    findByShortId(shortId: string): Promise<ShortLinkM | null>;
}