export class Finding {
    constructor(
        public finding_section : number,
        public finding_type : number,
        public finding_finding : string,
        public finding_code : string,
        public finding_description : string,
        public finding_recommendation : string,
        public finding_notes : string,
        public finding_uses_chemicals : number,
        public job_id : number,
        public finding_extras : string,
        
        public finding_bid_crew_notes : string,
        public finding_code_data : {
            code_special_pricing_notes : string,
            code_extras: string,
            code_finding: string,
            code_id: any,
            code_is_deleted: any,
            code_name: string,
            code_notes: string,
            code_recommendation: string,
            code_uses_chemicals: any
        },
        public finding_bid_primary_type : string,
        public finding_bid_hours : number,
        public finding_bid_hours_perc : number,
        public finding_bid_materials : any,
        public finding_bid_subcontractor : any,
        public finding_bid_primary : any,
        public finding_bid_secondary : any,
        public finding_bid_secondary_recommendation : string,
        public finding_bid_secondary_crew_notes : string,
        public finding_bid_secondary_hours : any,
        public finding_bid_secondary_hours_perc : any,
        public finding_bid_secondary_materials : any,
        public finding_bid_secondary_subcontractor : any,
        public finding_bid_hours_sub_total : any,
        public finding_bid_materials_subtotal : any,
        
        public finding_bid_subcontractor_subtotal : any,
        public finding_notes_position : string,
        public finding_bid_primary_alt : string,
        public finding_bid_primary_alt_other : string,
        public finding_bid_linear_feet : any,
        public finding_bid_secondary_linear_feet : any,
        public finding_notes_only : any,

        public finding_bid_secondary_type:string,
        public finding_bid_secondary_alt:string,
        public finding_bid_secondary_alt_other:string




    ) {

    }
}