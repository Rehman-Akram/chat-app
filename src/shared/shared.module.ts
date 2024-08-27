import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { EmailService } from './email.service';

@Module({
  providers: [SharedService, EmailService],
  exports: [SharedService, EmailService],
})
export class SharedModule {}
