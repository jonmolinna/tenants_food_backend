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
  @PrimaryGeneratedColumn('uuid') // UUID
  id: string;

  @Column({ type: 'char', length: 11, unique: true }) // RUC
  ruc: string;

  @Column({ type: 'varchar', length: 20, nullable: true }) // TELEFONO
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true }) // EMAIL
  email: string;

  @Column({ type: 'text', nullable: true }) // DIRECCION
  address: string;

  @Column({ type: 'varchar', length: 500, name: 'logo_url', nullable: true }) // URL DEL LOGO
  logoUrl: string;

  @Column({ type: 'varchar', length: 255, nullable: true }) // SITIO WEB - SLUG
  website: string;

  @Column({ type: 'varchar', length: 50, default: 'America/Lima' }) // ZONA HORARIA
  timezone: string;

  @Column({ type: 'varchar', length: 3, default: 'PEN' }) // TIPO DE MONEDA
  currency: string;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    name: 'tax_percent',
    default: 18.0,
  }) // PORCENTAJE DE IMPUESTO
  taxPercent: number;

  @Column({ type: 'text', nullable: true }) // DESCRIPCION
  description: string;

  @Column({ type: 'varchar', length: 5, name: 'opening_time', nullable: true }) // HORA DE APERTURA
  openingTime: string;

  @Column({ type: 'varchar', length: 5, name: 'closing_time', nullable: true }) // HORA DE CIERRE
  closingTime: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' }) // FECHA DE CREACION
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' }) // FECHA DE ACTUALIZACION
  updatedAt: Date; 

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp' }) // FECHA DE ELIMINACION
  deletedAt: Date;

  // TABLA DE RELACIONES 1 - 1 CON TENANT (UN TENANT TIENE UN PERFIL, UN PERFIL PERTENECE A UN TENANT)
  @OneToOne(() => Tenant, { onDelete: 'CASCADE' }) // 
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
