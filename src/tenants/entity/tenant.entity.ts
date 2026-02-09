import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TenantProfile } from '../../tenant-profile/entity/tenant-profile.entity';
import { Plan } from 'src/plans/entity/plan.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 120, nullable: false })
  name: string;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  domain: string;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Index()
  @Column({ name: 'plan_id', type: 'uuid' })
  planId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  subscriptionEndsAt: Date; // fecha de vencimiento

  // AUDITORIA
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;

  // RELATIONS
  // Tenant 1 - 1 TenantProfile
  @OneToOne(() => TenantProfile, (profile) => profile.tenant)
  profile: TenantProfile;

  // Plan 1 - N tenant
  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;
}
