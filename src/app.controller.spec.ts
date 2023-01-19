import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';

describe('AppController', () => {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [SharedModule],
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe('root', () => {
        it('should return "apiSemanticVersion"', () => {
            expect(appController.getVersion()).toHaveProperty(
                'apiSemanticVersion',
            );
        });
    });
    describe('GET /status', () => {
        it('should return "status"', () => {
            expect(appController.getServerStatus()).toHaveProperty('status');
        });
    });
});
