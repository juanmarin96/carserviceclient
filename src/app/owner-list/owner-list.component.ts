import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CarService } from '../shared/car/car.service';
import { GiphyService } from '../shared/giphy/giphy.service';
import { OwnerService } from '../shared/owner/owner.service';

@Component({
  selector: 'app-owner-list',
  templateUrl: './owner-list.component.html',
  styleUrls: ['./owner-list.component.css']
})
export class OwnerListComponent implements OnInit {
  owners: any;
  deleting = false;
  ownersToDelete : any[]=[];
  cars: any[];
  constructor(    
    private ownerService: OwnerService,
    private carService: CarService) { 
    
  }

  ngOnInit() {
    this.getCars();
    this.getOwners();
  }

  getOwners(){
    this.ownerService.getAll().subscribe(owners =>{
      this.owners = owners;
    });
  }

  getCars() {
    this.carService.getAll().subscribe(data => {
      this.cars = data;
    });
  }

  deleteOwners(){
    let dnis = this.owners.filter(x => x.delete == true);
    this.cleanOwnersFromCars(dnis.map(x => x.dni));
    this.deleteMultipleOwners(dnis)
  }

  cleanOwnersFromCars(owners: any[]){
    let carsToClean = this.cars.filter(x => owners.includes(x.ownerDni));
    if(carsToClean.length > 0){
      for (let car of carsToClean) {
        car.ownerDni = null;
        this.carService.cleanCarOwner(car).subscribe(car =>{
          console.log(`Car with id '${car.id}'cleaned`)
        });
      }
    }
  }

  deleteMultipleOwners(owners: any[]){
    for(let owner of owners){
      console.log(owner)
      this.ownerService.remove(owner._links.self.href).subscribe(result => {
        console.log(`Owner with DNI '${owner.dni}' deleted`)
        this.getOwners()
      }, error => console.error(error));
    }
    
  }
}
