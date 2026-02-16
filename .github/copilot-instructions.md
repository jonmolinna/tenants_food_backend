# Guía Backend NestJS

Este proyecto usa NestJS con TypeORM y sigue una arquitectura SaaS modular y escalable.

## Reglas de Arquitectura

- Usar DTOs con class-validator para todas las entradas
- Mantener los controllers ligeros, la lógica va en los services
- Usar correctamente la inyección de dependencias
- Usar UUID como claves primarias
- Incluir borrado lógico con deleted_at
- Usar snake_case en columnas de base de datos
- Definir relaciones con JoinColumn explícitos

## Reglas Multi-Tenant

- Toda entidad de negocio debe pertenecer a un tenant
- Usar tenantId como clave foránea indexada
- Nunca devolver datos de otros tenants
- Validar límites del plan antes de crear recursos

## Planes y Límites

Los planes controlan funciones del sistema:

- hasInventory → habilita módulo de inventario
- hasKitchenScreen → habilita pantalla de cocina
- maxUsers → límite de usuarios
- maxBranches → límite de sucursales
- maxInvoicesPerMonth → límite mensual de facturas

## Estilo de Código

- Usar async/await
- No poner lógica de negocio en controllers
- Crear servicios reutilizables
- Manejar errores con excepciones de NestJS

## Testing

- Generar pruebas unitarias con Jest
- Usar mocks de repositorios en pruebas de servicios
- Usar Supertest para pruebas e2e
