import { Tenant } from 'src/tenants/entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'branches' })
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 50, default: 'America/Lima' })
  timezone: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    name: 'tax_percent',
    default: 18.0,
  })
  taxPercent: number;

  @Column({ default: true })
  isActive: boolean;

  // Horarios
  @Column({ type: 'json', nullable: true })
  openingHours: {
    day: string;
    open: string;
    close: string;
  }[];

  // Configuracion de impresoras
  @Column({ type: 'json', nullable: true })
  printers: {
    kitchen?: string;
    cashier?: string;
  };

  // Maneja Inventario
  @Column({ type: 'boolean', default: true })
  hasInventory: boolean;


  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' })
  deletedAt: Date;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}

// PRINTERS
// {
//   "kitchen": "EPSON-KITCHEN-01",
//   "cashier": "EPSON-CAJA-01"
// }

// HORARIO
// [
//   { "day": "monday", "open": "09:00", "close": "23:00" },
//   { "day": "tuesday", "open": "09:00", "close": "23:00" },
//   { "day": "sunday", "open": "12:00", "close": "20:00" }
// ]
