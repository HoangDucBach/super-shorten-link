import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'short_links' })
export class ShortLink {
    @PrimaryColumn({ type: 'varchar', length: 12 })
    short_id: string;

    @Column({ type: 'text', nullable: false })
    long_url: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}