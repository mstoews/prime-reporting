import { AppComponent } from './app.component';
import { appConfig } from './app.config';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZoneChangeDetection } from "@angular/core";
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1JFaF5cXGRCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWH1ednVURmVcUkR2WEFWYEg=');


bootstrapApplication(AppComponent, {...appConfig, providers: [provideZoneChangeDetection(), ...appConfig.providers]}).catch((err) => console.error(err));
