import { GetAllShortLinkHandler, GetShortLinkByIdHandler } from "./queries/short-link.handler";
import { ShortLinkToReadDatabaseHandler } from "./events/short-link-to-read-database.handler";
import { ShortLinkCacheHandler } from "./events/short-link-cache.handler";
import { CreateShortLinkHandler } from "./commands/short-link.handler";

export const CommandHandlers = [CreateShortLinkHandler];
export const QueryHandlers = [GetShortLinkByIdHandler, GetAllShortLinkHandler];
export const EventsHandlers = [ShortLinkToReadDatabaseHandler, ShortLinkCacheHandler];