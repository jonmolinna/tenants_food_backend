import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TenantProfile } from '../../tenant-profile/entity/tenant-profile.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({type: 'varchar',  length: 120, nullable: false })
  name: string;

  @Index()
  @Column({ type: 'varchar', length: 255, unique: true })
  domain: string;

  @Index()
  @Column({type: 'varchar', length: 255, unique: true})
  slug: string;

  @Column({default: 'FREE'})
  plan: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({name: 'created_at', type: 'timestamp'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at', type: 'timestamp'})
  updatedAt: Date;

  @DeleteDateColumn({name: 'deleted_at', type: 'timestamp'})
  deletedAt: Date;

  @OneToOne(() => TenantProfile, profile => profile.tenant)
  profile: TenantProfile;
}

// PLANS
// FREE | PRO | ENTERPRISE