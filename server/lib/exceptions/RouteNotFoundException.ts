export class RouteNotFoundException extends Error {
    constructor(method: string, route: string) {
      super();
    }
}
