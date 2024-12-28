import { Controller, Get } from '@nestjs/common';
import { AccountCreatorService } from './account-creator.service';

@Controller()
export class AccountCreatorController {
  constructor(private readonly accountCreatorService: AccountCreatorService) {}

  @Get()
  getHello(): string {
    return this.accountCreatorService.getHello();
  }
}
