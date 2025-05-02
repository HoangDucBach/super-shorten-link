import { CreateShortLinkDto, CreateShortLinkForReadDto } from 'src/presentations/short-link/dto/create-short-link.dto';
import { ShortLinkForReadM, ShortLinkM } from '../model/short-link';

export interface ShortLinkRepository {
    writeShortLinkToReadDatabase(shortLink: CreateShortLinkForReadDto): Promise<ShortLinkForReadM>;
    getAllShortLinkFromReadDatabase(): Promise<ShortLinkForReadM[]>;
    getShortLinkByIdFromReadDatabase(shortId: string): Promise<ShortLinkForReadM | null>;
    getAllShortLinkFromReadDatabase(): Promise<ShortLinkForReadM[]>;

    createShortLink(createShortLinkDto: CreateShortLinkDto): Promise<ShortLinkM>;
    getShortLinkById(shortId: string): Promise<ShortLinkForReadM | null>;

    writeShortLinkToWriteDatabase(shortLink: CreateShortLinkDto): Promise<ShortLinkM>;
    getAllShortLinkFromWriteDatabase(): Promise<ShortLinkM[]>;
    getShortLinkByIdFromWriteDatabase(shortId: string): Promise<ShortLinkM | null>;
    getAllShortLinkFromWriteDatabase(): Promise<ShortLinkM[]>;
}