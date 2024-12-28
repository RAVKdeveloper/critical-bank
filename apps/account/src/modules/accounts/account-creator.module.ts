import { Module } from '@nestjs/common';
import { AccountCreatorController } from './account-creator.controller';
import { AccountCreatorService } from './account-creator.service';

@Module({
  imports: [],
  controllers: [AccountCreatorController],
  providers: [AccountCreatorService],
})
export class AccountCreatorModule {}
