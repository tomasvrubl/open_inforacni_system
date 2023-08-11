import {HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseService } from './base.service';
import {Response} from '../_obj/common';



@Injectable()
export class AuthenticationService extends BaseService {

    constructor( http: HttpClient) {
        super(http);
    }

    lostPassword(eml: string) : Promise<Response> {        
        return this.post<Response>( { eml: eml, controller: 'ws\\Security\\UserController::lostPassword' });
    }
    
}
