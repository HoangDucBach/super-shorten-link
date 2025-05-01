import { CreateShortLinkDto } from 'src/presentations/short-link/dto/create-short-link.dto';
import { ShortLinkM } from '../model/short-link';

export interface ShortLinkRepository {
    getAllShortLink(): Promise<ShortLinkM[]>;
    createShortLink(createShortLinkDto: CreateShortLinkDto): Promise<ShortLinkM>;
    getShortLinkById(shortId: string): Promise<ShortLinkM | null>;
}