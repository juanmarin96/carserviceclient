import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { CarService } from '../shared/car/car.service';
import { GiphyService } from '../shared/giphy/giphy.service';
import { OwnerService } from '../shared/owner/owner.service';

@Component({
  selector: 'app-owner-edit',
  templateUrl: './owner-edit.component.html',
  styleUrls: ['./owner-edit.component.css']
})
export class OwnerEditComponent implements OnInit {
  owner: any = {};
  sub: Subscription;
  owners$: Observable<any>;
  cars: any[];
  constructor(
    private ownerService: OwnerService,
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService) {
  }

  ngOnInit() {
    this.getCars();
    this.getOwners();
    this.sub = this.route.params.subscribe(params => {
      const dni = params['id'];
      if (dni) {
        this.owners$.subscribe(owners=>{
          let owner = owners.find(x => x.dni == dni) || null;
          if(owner){
            this.owner = owner;
            this.owner.href = owner._links.self.href;
          }else {
            console.log(`Owner with DNI '${dni}' not found, returning to list`);
            this.gotoList();
          }          
        })
        
      }
    });
  }

  getOwners(){
    this.owners$ = this.ownerService.getAll();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  gotoList() {
    this.router.navigate(['/owner-list']);
  }

  save(form: NgForm) {
    this.ownerService.save(form).subscribe(result => {
      this.gotoList();
    }, error => console.error(error));
  }

  remove(owner) {
    this.ownerService.remove(owner.href).subscribe(result => {
      this.cleanOwnersFromCars([owner.dni])
      this.gotoList();
    }, error => console.error(error));
  }

  getCars() {
    this.carService.getAll().subscribe(data => {
      this.cars = data;
    });
  }

  cleanOwnersFromCars(owners: any[]){
    let carsToClean = this.cars.filter(x => owners.includes(x.ownerDni));
    console.log(carsToClean)
    if(carsToClean.length > 0){
      for (let car of carsToClean) {
        car.ownerDni = null;
        this.carService.cleanCarOwner(car).subscribe(car =>{
          console.log(`Car with id '${car.id}'cleaned`)
        });
      }
    }
  }

}
