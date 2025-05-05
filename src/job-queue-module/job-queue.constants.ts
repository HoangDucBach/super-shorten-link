// src/job-queue-module/job-queue.constants.ts

// --- Queue Names ---
/**
 * Queue responsible for persisting short links to the primary database.
 */
export const QUEUE_PERSISTENCE = 'shortlink-persistence'; // Use a descriptive name

// --- Job Names within Queues ---
/**
 * Name of the job added to the QUEUE_PERSISTENCE for writing a short link.
 */
export const JOB_PERSIST_SHORTLINK = 'persist-shortlink';

// --- Processor Names (Matching Queue Names Usually) ---
// Often the processor name matches the queue name it processes
// No separate constant needed if @Processor uses the QUEUE_PERSISTENCE constant.