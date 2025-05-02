import { CreateShortLinkHandler } from "./create-short-link.handler";
import { GetShortLinkByIdHandler } from "./get-short-link-by-id.handler";

export const CommandHandlers = [CreateShortLinkHandler];
export const QueryHandlers = [GetShortLinkByIdHandler];
