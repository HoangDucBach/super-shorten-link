import { ShortLinkForReadM, ShortLinkM } from 'src/domains/model/short-link';
import { ShortLinkRepository } from 'src/domains/repositories/short-link.repository';
import { CreateShortLinkDto, CreateShortLinkForReadDto } from 'src/presentations/short-link/dto/create-short-link.dto';

export class CreateShortLinkUseCases {
    constructor(
        private shortLinkReposity: ShortLinkRepository
    ) { }

    async execute(createShortLinkDto: CreateShortLinkDto): Promise<ShortLinkM> {
        return await this.shortLinkReposity.createShortLink(createShortLinkDto);
    }
}

export class GetShortLinkByIdUseCases {
    constructor(private shortLinkReposity: ShortLinkRepository) { }

    async execute(shortId: string): Promise<ShortLinkForReadM | null> {
        return await this.shortLinkReposity.getShortLinkById(shortId);
    }
}

export class WriteShortLinkToWriteDatabaseUseCases {
    constructor(private shortLinkReposity: ShortLinkRepository) { }

    async execute(createShortLinkForReadDto: CreateShortLinkForReadDto): Promise<ShortLinkForReadM | null> {
        return await this.shortLinkReposity.writeShortLinkToWriteDatabase(createShortLinkForReadDto);
    }
}

export class WriteShortLinkToReadDatabaseUseCases {
    constructor(private shortLinkReposity: ShortLinkRepository) { }

    async execute(createShortLinkForReadDto: CreateShortLinkForReadDto): Promise<ShortLinkForReadM | null> {
        return await this.shortLinkReposity.writeShortLinkToReadDatabase(createShortLinkForReadDto);
    }
}

export class GetAllShortLinkFromReadDatabaseUseCases {
    constructor(private shortLinkReposity: ShortLinkRepository) { }

    async execute(): Promise<ShortLinkForReadM[] | null> {
        return await this.shortLinkReposity.getAllShortLinkFromReadDatabase();
    }
}

export class GetAllShortLinksFromWriteDatabaseUseCases {
    constructor(private shortLinkReposity: ShortLinkRepository) { }

    async execute(): Promise<ShortLinkM[] | null> {
        return await this.shortLinkReposity.getAllShortLinkFromWriteDatabase();
    }
}

export class GetShortLinkByIdFromReadDatabaseUseCases {
    constructor(private shortLinkReposity: ShortLinkRepository) { }

    async execute(shortId: string): Promise<ShortLinkForReadM | null> {
        return await this.shortLinkReposity.getShortLinkByIdFromReadDatabase(shortId);
    }
}

export class GetShortLinkByIdFromWriteDatabaseUseCases {
    constructor(private shortLinkReposity: ShortLinkRepository) { }

    async execute(shortId: string): Promise<ShortLinkM | null> {
        return await this.shortLinkReposity.getShortLinkByIdFromWriteDatabase(shortId);
    }
}