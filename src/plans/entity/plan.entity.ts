import { Tenant } from 'src/tenants/entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 120 })
  name: string;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  price: number; // 0 - 49.99

  @Column({ default: 1 })
  maxBranches: number; // sucursal

  @Column({ default: 3 })
  maxUsers: number; // usuarios

  @Column({ default: false })
  hasInventory: boolean; // inventario

  @Column({ default: false })
  hasWhatsApp: boolean;

  @Column({ default: false })
  hasKitchenScreen: boolean; // tiene pantalla de cocina

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 20})
  maxInvoicesPerMonth: number;

  @Column({ default: 50})
  maxReceiptsPerMonth: number;



  // RELATIONS
  // Plan 1 - N tenant
  @OneToMany(() => Tenant, (tenant) => tenant.plan)
  tenants: Tenant[];
}

// FREE - PRO - ENTERPRISE
