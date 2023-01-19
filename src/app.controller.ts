import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getVersion(): { [key: string]: string } {
        return this.appService.getVersion();
    }

    @Get('status')
    getServerStatus(): { [key: string]: string } {
        return this.appService.getServerStatus();
    }

    @Get('/healthcheck')
    @ApiOkResponse()
    getHealthchkec() {
        return { healthchecck: 'OK' };
    }
}
