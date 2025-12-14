import { AppComponent } from './app.component';
import { Core } from "@mescius/activereportsjs";
import { appConfig } from './app.config';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZoneChangeDetection } from "@angular/core";
import { registerLicense } from '@syncfusion/ej2-base';

const licenseKey = 'localhost:43002,135653967381325#B1hQVZxNHMqBjSMFVV7wER8IDO6pEbPR4a6hjUDpUR5dkMxkmRidzN0FTT6cHZIR4bKlWYNdnTmR5Tvc5KXVXTY56NUVWNs5EZ8RTZnljYzcFS6kVOBhTQKdjNTFTUkVmQ5gDSpZXMzZkWxljQvIVdUdzRFVTUyYHb9MDcJdkNQRVUxg4Yhd4NwtEa7lkaQ5WWGR4LSZ4KqNHa4RlYBFmZ5IGcil7KDV6SiVWbKZFVvJGaGlneFRGa8pmVGRleYNHO9MVOOd5URVTU94WU0BzMNhGM9E5UlBlMDRkcxp5bvVHR8UmWGlDertSTXFGaI3yNnJiOiMlIsICRBRURBRjNxIiOigkIsEzNwczMxcDO0IicfJye35XX3JSUXd5QiojIDJCLiYjVgMlS4J7bwVmUlZXa4NWQiojIOJyebpjIkJHUiwiI9AzNwITMgQTMyETNyAjMiojI4J7QiwiIt36YuIXZnRWZsVGbi3mbiojIz5GRiwiIyV6ZkVGblxmYv9kI0ISYONkIsISNyMTM8MzN6kzM5YTNzEjI0ICZJJCL355W0IyZsZmIsU6csFmZ0IiczRmI1pjIs9WQisnOiQkIsISP3E4MMFnTHJVamlFNhtWYXFUWmZGcjlDZ7tGTnhzcWR5MTZ4M6QmRTFHS8InWXdDZTRzM43GaBJ6No5GZa5GRHlVMmNmaGJkWrE4TzMFW5N6YUJTOzBjaWNTQ9RnRHtmSCJkSe3JW';

registerLicense('Ngo9BigBOggjHTQxAR8/V1JFaF5cXGRCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdmWH1ednVURmVcUkR2WEFWYEg=');

// Core.setLicenseKey(licenseKey);

bootstrapApplication(AppComponent, {...appConfig, providers: [provideZoneChangeDetection(), ...appConfig.providers]}).catch((err) => console.error(err));
