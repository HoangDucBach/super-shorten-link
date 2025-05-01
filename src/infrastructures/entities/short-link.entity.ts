import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'short_links' })
export class ShortLink {
    @PrimaryColumn({ type: 'varchar', length: 12, name: 'short_id' })
    shortId: string;

    @Column({ type: 'text', nullable: false, name: 'long_url' })
    longUrl: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    created_at: Date;
}