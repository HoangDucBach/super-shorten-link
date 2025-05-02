import { CreateShortLinkHandler } from "./create-short-link.handler";
import { GetShortLinkByIdHandler } from "./get-short-link-by-id.handler";
import { RedirectShortLinkHandler } from "./redirect-short-link.handler";

export const CommandHandlers = [CreateShortLinkHandler];
export const QueryHandlers = [GetShortLinkByIdHandler];
