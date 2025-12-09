import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Set document title from environment
document.title = environment.appConfig.appTitle;

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
