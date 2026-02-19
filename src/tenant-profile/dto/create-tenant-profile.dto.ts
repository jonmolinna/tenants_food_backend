import {
  IsString,
  IsOptional,
  Length,
  Matches,
  IsNumber,
  Min,
  Max,
  IsIn,
  IsUrl,
  MaxLength,
  IsEmail,
} from 'class-validator';

export class CreateTenantProfileDto {
  // RUC: Validar formato peruano (10, 15, 17, 20 + 9 dígitos)
  @IsString()
  @Length(11, 11, { message: 'El RUC debe tener exactamente 11 dígitos' })
  @Matches(/^(10|15|17|20)[0-9]{9}$/, {
    message: 'RUC inválido. Debe iniciar con 10, 15, 17 o 20 y tener 11 dígitos',
  })
  ruc: string;

  // Teléfono: Formato peruano (celular o fijo)
  @IsString()
  @IsOptional()
  phone?: string;

  // Email de contacto
  @IsEmail({}, { message: 'Email inválido' })
  @IsOptional()
  @MaxLength(255)
  email?: string;

  // Dirección
  @IsString()
  @IsOptional()
  @Length(5, 500, { message: 'La dirección debe tener entre 5 y 500 caracteres' })
  address?: string;

  // Logo URL: Validar que sea URL válida y formato de imagen
  @IsUrl({}, { message: 'La URL del logo no es válida' })
  @IsOptional()
  @MaxLength(500)
  @Matches(/\.(jpg|jpeg|png|webp)$/i, {
    message: 'El logo debe ser una imagen válida (jpg, png, webp)',
  })
  logoUrl?: string;

  // Website
  @IsUrl({}, { message: 'URL del sitio web inválida' })
  @IsOptional()
  @MaxLength(255)
  website?: string;

  // Zona horaria: Solo zonas de Latinoamérica
  @IsString()
  @IsOptional()
  @IsIn(
    [
      'America/Lima',
      'America/Mexico_City',
      'America/Bogota',
      'America/Santiago',
      'America/Argentina/Buenos_Aires',
      'America/Caracas',
      'America/Guayaquil',
    ],
    { message: 'Zona horaria no soportada' },
  )
  timezone?: string;

  // Moneda: Principales de Latinoamérica
  @IsString()
  @IsOptional()
  @Length(3, 3)
  @IsIn(['PEN', 'USD', 'EUR', 'MXN', 'COP', 'CLP', 'ARS', 'BOB', 'UYU'], {
    message: 'Moneda no soportada',
  })
  currency?: string;

  // Porcentaje de impuesto
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El impuesto debe tener máximo 2 decimales' })
  @Min(0, { message: 'El impuesto no puede ser negativo' })
  @Max(100, { message: 'El impuesto no puede exceder 100%' })
  taxPercent: number;

  // Descripción del restaurante
  @IsString()
  @IsOptional()
  @Length(10, 1000, { message: 'La descripción debe tener entre 10 y 1000 caracteres' })
  description?: string;

  // Horario de apertura (formato HH:MM)
  @IsString()
  @IsOptional()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Formato de hora de apertura inválido. Use HH:MM (ej: 09:00)',
  })
  openingTime?: string;

  // Horario de cierre (formato HH:MM)
  @IsString()
  @IsOptional()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Formato de hora de cierre inválido. Use HH:MM (ej: 22:00)',
  })
  closingTime?: string;
}
