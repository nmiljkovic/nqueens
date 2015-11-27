import {bootstrap, provide, FORM_PROVIDERS} from "angular2/angular2";
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from "angular2/router";
import {HTTP_PROVIDERS} from "angular2/http";
import {AppComponent} from "./component";
import {Simulation, BoardEditor, VisualOptions} from "./simulation";

let boot = bootstrap(AppComponent, [
    ROUTER_PROVIDERS,
    FORM_PROVIDERS,
    HTTP_PROVIDERS,
    provide(LocationStrategy, { useClass: HashLocationStrategy }),
    Simulation,
    BoardEditor,
    VisualOptions,
])

boot.then(
    null,
    error => console.log(error)
);
