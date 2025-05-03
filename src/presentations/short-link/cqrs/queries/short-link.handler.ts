import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { UsecaseProxyModule } from "src/infrastructures/usecase-proxy/usecase-proxy.module";
import { Inject } from "@nestjs/common";
import { UseCaseProxy } from "src/infrastructures/usecase-proxy/usecase-proxy";
import { ShortLinkForRead } from "src/infrastructures/entities/short-link.entity";
import { GetAllShortLinkFromReadDatabaseUseCases, GetShortLinkByIdUseCases } from "src/applications/use-cases/short-link.usecase";
import { GetAllShortLinkQuery, GetShortLinkByIdQuery } from "./short-link.query";

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

@QueryHandler(GetAllShortLinkQuery)
export class GetAllShortLinkHandler implements IQueryHandler<GetAllShortLinkQuery> {
    constructor(
        @Inject(UsecaseProxyModule.GET_ALL_SHORT_LINKS_FROM_READ_DATABASE_USE_CASE)
        private readonly getAllShortLinkUseCases: UseCaseProxy<GetAllShortLinkFromReadDatabaseUseCases>,
    ) { }

    async execute(): Promise<ShortLinkForRead[] | null> {
        return this.getAllShortLinkUseCases.getInstance().execute();
    }
}