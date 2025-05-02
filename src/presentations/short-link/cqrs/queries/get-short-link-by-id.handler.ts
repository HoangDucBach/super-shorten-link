import { GetShortLinkByIdQuery } from "./get-short-link-by-id.command";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ShortLinkM } from "src/domains/model/short-link";
import { UsecaseProxyModule } from "src/infrastructures/usecase-proxy/usecase-proxy.module";
import { Inject } from "@nestjs/common";
import { UseCaseProxy } from "src/infrastructures/usecase-proxy/usecase-proxy";
import { GetShortLinkByIdUseCases } from "src/applications/use-cases/getShortLinkByShortId.usecase";
import { ShortLinkForRead } from "src/infrastructures/entities/short-link.entity";

@QueryHandler(GetShortLinkByIdQuery)
export class GetShortLinkByIdHandler implements IQueryHandler<GetShortLinkByIdQuery> {
    constructor(
        @Inject(UsecaseProxyModule.GET_SHORT_LINK_BY_ID_USE_CASE)
        private readonly getShortLinkByIdUseCases: UseCaseProxy<GetShortLinkByIdUseCases>,
    ) { }

    async execute(query: GetShortLinkByIdQuery): Promise<ShortLinkForRead | null> {
        const { shortId } = query;
        return this.getShortLinkByIdUseCases.getInstance().execute(shortId);
    }
}