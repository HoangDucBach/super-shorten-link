export class CreateShortLinkCommand {
    constructor(
      public readonly shortId: string,
      public readonly longUrl: string,
    ) {
    }
  }
  