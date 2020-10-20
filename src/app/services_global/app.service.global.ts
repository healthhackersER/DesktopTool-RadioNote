import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, listChanges } from 'angularfire2/database';
import {Entity} from '../models/entity'
@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {
    //Diary: Diary;
    list$: Array<Entity> = new Array<Entity>();
    constructor (private db: AngularFireDatabase){
      /* Connect to fire base */
      this.list$.push(new Entity("entity one"));
      this.list$.push(new Entity("entity two"));
      this.list$.push(new Entity("entity three"));
    }

    addEntry(new_entity: Entity) {
        this.list$.push(new_entity);
    }

    getEntries(){
        return this.list$;
    }
}
