import { Command } from "@nestjs/cqrs";

export class CreateShortLinkCommand {
  constructor(
    public readonly longUrl: string,
  ) {
  }
}
