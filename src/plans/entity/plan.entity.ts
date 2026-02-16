import { Max, Min } from 'class-validator';
import { Tenant } from 'src/tenants/entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // SLUG = FREE - PRO - ENTERPRISE
  @Column({ length: 50, unique: true })
  @Index()
  code: string;

  // NOMBRE DEL PLAN
  @Column({ length: 120 })
  name: string;

  // PRECIO
  @Column({ type: 'decimal', precision: 8, scale: 2 })
  @Min(0)
  @Max(999999.99)
  price: number; // 0 - 49.99

  // SUCURSAL
  @Column({ default: 1 })
  maxBranches: number;

  // MAXIMO DE USUARIOS
  @Column({ default: 3 })
  maxUsers: number; // usuarios

  // TIENE INVENTARIO
  @Column({ default: false })
  hasInventory: boolean; // inventario

  // TIENE WHATSAPP
  @Column({ default: false })
  hasWhatsApp: boolean;

  // tiene pantalla de cocina
  @Column({ default: false })
  hasKitchenScreen: boolean;

  // Esta activo
  @Column({ default: true })
  isActive: boolean;

  // Facturas máximas por mes
  @Column({ default: 20 })
  maxInvoicesPerMonth: number;

  // Boletas máximas por mes
  @Column({ default: 50 })
  maxReceiptsPerMonth: number;

  // RELATIONS
  // Plan 1 - N tenant
  @OneToMany(() => Tenant, (tenant) => tenant.plan)
  tenants: Tenant[];
}

// FREE - PRO - ENTERPRISE
