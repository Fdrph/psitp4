import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { Pet } from '../pet';
import { PetService } from '../pet.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: [ './hero-detail.component.css' ]
})
export class HeroDetailComponent implements OnInit {
  hero: Hero | undefined;
  pets: Pet[] = [];
  selectedPetName: string = "No Pet";

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private petService: PetService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getHero();
    this.getPets();
  }

  getHero(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.heroService.getHero(id).subscribe(hero => { 
      this.hero = hero;
      if(this.hero.pet) {this.selectedPetName = this.hero.pet.name}
    });
  }

  getPets(): void {
    this.petService.getPets().subscribe(pets => this.pets = pets);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (!this.hero) {return}

    this.hero.pet = null;
    if (this.selectedPetName != "No Pet") { 
      let p = this.pets.find(x => x.name === this.selectedPetName);
      if(p) {this.hero.pet = p;}
    }

    this.heroService.updateHero(this.hero).subscribe(() => this.goBack());
  }


}
