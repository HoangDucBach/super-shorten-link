import { ShortLink } from "src/infrastructures/entities/short-link.entity";

export class ShortLinkCreatedEvent {
  constructor(
    public readonly shortLink: ShortLink,
  ) { }
}
