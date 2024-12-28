import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountCreatorService {
  getHello(): string {
    return 'Hello World!';
  }
}
