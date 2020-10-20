import { Component, OnInit} from '@angular/core';
import {Entity} from '../models/entity';

@Component({
  selector: 'module-two',
  templateUrl: './module.two.html',
  styleUrls: ['./module.two.scss']
})

export class ModuleTwo implements OnInit {
  entity$: Entity;
  name: String = "Module Two - Single Entity Example"
  constructor() {
    this.entity$ = new Entity("I am a <Entity> of module two");
  }
  ngOnInit() {
    this.entity$ = new Entity("I am a <Entity> of module two");
  }
}


