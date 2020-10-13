# GAInsights
<p align="center">
  <img alt="Client" src="https://github.com/felixcabreraranklin/GAInsights/blob/master/Documentation/a.png?raw=true">
</p>

Project: Todo list application

* Add Items

 Name, description, priority  <strong>(OK)</strong>

* Remove items  <strong>(OK)</strong>

* Store/persist items across sessions (can work on a local emulator)  <strong>(OK)</strong>

* Logs operations for debugging purposes  <strong>(OK)</strong>


* Call 3rd party dependency (any free API of your choice, doesn’t need make sense to the to-do list app <strong>(OK)</strong>

* Technology choice is yours, but please keep it to .Net, .Net Core, Blazor, MVC, Knockoutjs, Razor or AngularJS.  <strong>(OK)</strong><u>AngularJS and NetCore</u>

### Extra points

* For an SPA implementation with clear separation between API and Client <strong>(OK)</strong>
* For unit tests, integrations tests or behavior tests(I need make more)
* For using CosmosDb for the storage layer <strong>(NO)</strong>
* For SOLID code design principles <strong>(OK)</strong>
* If you use Blazor Wasm or Server-side <strong>(Server-side)Project: Todo list application</strong>

### Good practices and extra tasks by the Team.
* Repository Pattern
* Unit of Work pattern
* Separation of concerns (Service, Data access, Common)
* Swagger for API Documentation
* Global Error Handling with a middleware
* Memory database used and API https://api.mathjs.org/ for calling 3rd party dependency.

## The Client
You can run the solution in VS and open: https://localhost:5001/#/todo


## The Server
You can run the solution in VS and open: https://localhost:5003/swagger/index.html

<p align="center">
  <img alt="Server" src="https://github.com/felixcabreraranklin/GAInsights/blob/master/Documentation/b.png?raw=true">
</p>

#### NOTE:
if the server-domain changes then you should update the config.js of client in
ClientApp/wwwroot/application/config.js line 5
  ...
  var url = "https://localhost:5003/"; //var url = "https://gainsights.com/";
  ...



## License

Copyright (c) NTSprint. All rights reserved.