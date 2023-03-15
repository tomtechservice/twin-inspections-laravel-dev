export class Property {
    constructor(
        public property_id: number,
        public client_id: number,
        public job_id: number,
        public property_address1 :  string,
        public property_address2:  string,
        public property_city :  string ,
        public property_state :  string ,
        public property_zip:  number,
        public property_lat: number,
        public property_long: number,
        public property_use_google_maps: any,

        public property_type: any,
        public property_foundation: any,
        public property_year: number,
        public property_square_feet: number,
        public property_notes: number,
        public property_image_file: any,
        public multi_story: any,

        public job_sub_type:any,

        public property_access:any,
        public property_gate_code:any,
        public property_lock_box_code:any,

        public inspector_notes:any,
        public branch_id:any,
        
        public is_anytime: boolean



        // public property_address1: string,
        // public property_address2:string,
        // public property_city:string,
        // public property_state:string,
        // public property_zip:number,
        // public multi_story:any,
        
      ) {  }
    
}
