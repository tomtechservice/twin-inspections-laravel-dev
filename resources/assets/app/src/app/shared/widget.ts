export class Widget {
    constructor(
        public id: number,
        public text: string,
        public data_source_id: any,
        public branch_id: number,
        public agent_id: number,
        public goal: number,
        public data_type : string,
        public is_today :any,
        public from_date:any,
        public to_date:any,
        public goal_completed: number,

        // public from_date: string,
        // public to_date:string,
        
      ) {  }
    
}
