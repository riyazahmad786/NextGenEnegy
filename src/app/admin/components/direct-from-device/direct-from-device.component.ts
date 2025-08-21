import { Component } from '@angular/core';
import { MenuComponent } from '../../menu/menu.component';

@Component({
  selector: 'app-direct-from-device',
  standalone: true,
  imports: [MenuComponent],
  templateUrl: './direct-from-device.component.html',
  styleUrl: './direct-from-device.component.css'
})
export class DirectFromDeviceComponent {

}
