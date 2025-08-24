import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { LocalStorageStrategy } from './local-storage.strategy';

@Module({
  providers: [{
    provide: StorageService,
    useFactory: () => { 
        return new StorageService(new LocalStorageStrategy());
        // change to other strategies if needed
    },
  }],
  controllers: [StorageController],
  exports: [StorageService]
})
export class StorageModule {}
