import { Injectable } from '@angular/core';

/**
 * This is a singleton class
 */
@Injectable()
export class AppConfig {

    // public baseApiPath: String = 'https://jat-backend.herokuapp.com/api/';
    public baseApiPath: String = 'http://127.0.0.1:8000/api/';

    constructor() {}
}
