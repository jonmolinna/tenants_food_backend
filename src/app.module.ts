import { Module } from '@nestjs/common';
import { TenantsModule } from './tenants/tenants.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantProfileModule } from './tenant-profile/tenant-profile.module';
import { BranchesModule } from './branches/branches.module';
import { PlansModule } from './plans/plans.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'molina2624',
      database: 'rest_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TenantsModule,
    TenantProfileModule,
    BranchesModule,
    PlansModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
