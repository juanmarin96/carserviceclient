import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CarService } from '../shared/car/car.service';
import { GiphyService } from '../shared/giphy/giphy.service';
import { OwnerService } from '../shared/owner/owner.service';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {
  cars: Array<any>;
  owners: any = [];

  constructor(private ownerService: OwnerService,private carService: CarService, private giphyService: GiphyService) { 
    
  }

  ngOnInit() {
    this.getOwners();
  }

  private getCars() {
    this.carService.getAll().subscribe(data => {
      this.cars = data;
      for (const car of this.cars) {
        let owner = this.owners.find(x => x.dni == car.ownerDni) || null;
        car.owner = (owner != null) ? owner.name : "";
        this.giphyService.get(car.name).subscribe(url => car.giphyUrl = url);
      }
    });
  }

  getOwners(){
    this.ownerService.getAll().subscribe(owners=>{
      this.owners = owners;
      this.getCars();
    });
  }

}
