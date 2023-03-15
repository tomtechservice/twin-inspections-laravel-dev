import { Component, OnInit,Input} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  notifyChange;
  clientId;
  client: string[];
  constructor(
    private _router: Router,
    private router: ActivatedRoute,
    private clientService: ClientService,
    ) {

  }

  ngOnInit() {
    this.router.params.subscribe(params => {
      if (params.clientId) {
        this.clientId = params.clientId;
        this.editClient(this.clientId);
      }

    })
  }
  onNotify(message):void {
    this.notifyChange=message;
  }
  editClient(client_id){
    this.clientService.editClient(client_id).subscribe(
      data=>{
        this.client = data.data as string[];
      },
      error=>{
        
      }
    );
  }

}
