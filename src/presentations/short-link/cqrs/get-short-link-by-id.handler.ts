import { ShortLinkRepository } from "src/domains/repositories/short-link.repository";
import { ShortLink } from "src/infrastructures/entities/short-link.entity";
import { GetShortLinkByIdQuery } from "./get-short-link-by-id.command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ShortLinkM } from "src/domains/model/short-link";

@QueryHandler(GetShortLinkByIdQuery)
export class GetShortLinkByIdHandler implements IQueryHandler<GetShortLinkByIdQuery> {
    constructor(private shortLinkRepository: ShortLinkRepository) { }

    async execute(query: GetShortLinkByIdQuery): Promise<ShortLinkM | null> {
        const { shortId } = query;
        return this.shortLinkRepository.getShortLinkById(shortId);
    }
}