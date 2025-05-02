import { CreateShortLinkHandler } from "./commands/create-short-link.handler";
import { GetShortLinkByIdHandler } from "./queries/get-short-link-by-id.handler";
import { RedirectShortLinkHandler } from "./commands/redirect-short-link.handler";
import { ShortLinkCreatedHandler } from "./events/short-link-created.handler";

export const CommandHandlers = [CreateShortLinkHandler];
export const QueryHandlers = [GetShortLinkByIdHandler];
export const EventsHandlers = [ShortLinkCreatedHandler];