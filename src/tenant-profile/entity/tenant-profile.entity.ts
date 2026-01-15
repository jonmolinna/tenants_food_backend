import { Tenant } from 'src/tenants/entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'tenant_profile' })
export class TenantProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'char', length: 11, unique: true })
  ruc: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 255, name: 'logo_url', nullable: true })
  logoUrl: string;

  @Column({ type: 'varchar', length: 50, default: 'America/Lima' })
  timezone: string;

  @Column({ type: 'varchar', length: 3, default: 'PEN' })
  currency: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    name: 'tax_percent',
    default: 18.0,
  })
  taxPercent: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;

  @OneToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
