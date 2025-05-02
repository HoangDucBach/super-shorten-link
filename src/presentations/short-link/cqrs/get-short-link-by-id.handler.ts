import { ShortLinkRepository } from "src/domains/repositories/short-link.repository";
import { ShortLink } from "src/infrastructures/entities/short-link.entity";
import { GetShortLinkByIdQuery } from "./get-short-link-by-id.command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ShortLinkM } from "src/domains/model/short-link";
import { InjectRepository } from "@nestjs/typeorm";
import { DatabaseStreamType } from "src/domains/config/database.interface";
import { UsecaseProxyModule } from "src/infrastructures/usecase-proxy/usecase-proxy.module";
import { Inject } from "@nestjs/common";
import { UseCaseProxy } from "src/infrastructures/usecase-proxy/usecase-proxy";
import { GetShortLinkByIdUseCases } from "src/applications/use-cases/getShortLinkByShortId.usecase";

@QueryHandler(GetShortLinkByIdQuery)
export class GetShortLinkByIdHandler implements IQueryHandler<GetShortLinkByIdQuery> {
    constructor(
        @Inject(UsecaseProxyModule.GET_SHORT_LINK_BY_ID_USE_CASE)
        private readonly getShortLinkByIdUseCases: UseCaseProxy<GetShortLinkByIdUseCases>,
    ) { }

    async execute(query: GetShortLinkByIdQuery): Promise<ShortLinkM | null> {
        const { shortId } = query;
        return this.getShortLinkByIdUseCases.getInstance().execute(shortId);
    }
}