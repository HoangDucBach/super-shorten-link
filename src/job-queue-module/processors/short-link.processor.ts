import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ShortLinkM } from 'src/domains/model/short-link';
import { CommandBus } from '@nestjs/cqrs';
import { CreateShortLinkCommand } from 'src/presentations/short-link/cqrs/commands/short-link.command';
import { JOB_PERSIST_SHORTLINK, QUEUE_PERSISTENCE } from '../job-queue.constants';

@Processor(QUEUE_PERSISTENCE)
export class ShortLinkPersistenceProcessor extends WorkerHost {
    constructor(
        private commandBus: CommandBus,
    ) {
        super();
    }

    async process(job: Job<any, any, string>): Promise<any> {
        const { name, data } = job;

        switch (name) {
            case JOB_PERSIST_SHORTLINK: {
                try {
                    const shortLinkToPersist = new ShortLinkM();
                    shortLinkToPersist.shortId = data.shortId;
                    shortLinkToPersist.longUrl = data.longUrl;
                    shortLinkToPersist.createdAt = new Date(data.createdAt);

                    await this.commandBus.execute(
                        new CreateShortLinkCommand(
                            shortLinkToPersist.shortId,
                            shortLinkToPersist.longUrl,
                        )
                    )
                    return { status: 'persisted', shortId: data.shortId };

                } catch (error) {
                    console.error(`Failed to persist short link job ${job.id} for shortId ${data.shortId}:`, error);
                    throw error;
                }
            }
            default: {
                console.warn(`Persistence queue received job with unhandled name: ${name}`);
                break;
            }
        }
    }
}