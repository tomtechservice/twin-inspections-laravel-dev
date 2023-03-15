export class Client {
    constructor(
        public client_id:number,
        public client_first_name: string,
        public client_last_name: any,
        public client_notes: string,
        public client_phone: number,
        public client_email :  string,
        public client_address1 :  string,
        public client_address2 :  string,
        public client_city :  string,
        public client_state :  string,
        public client_zip :  string,
        public is_company:any,
        public company:any,
        public active_id:any,
        public billable_user:any,
        public lead_id:any,
        public job_id:number,
        public is_client:boolean


      ) {  }

}
