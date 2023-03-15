<?php
namespace App\Services;
use Illuminate\Support\Facades\Storage;

use App\Models\Chemical;
use DB;
use Auth;

class ChemicalsService{
    
    function __construct(){
        $this->chemicalsModel = new Chemical();
    }
    public function getChemicalUnit($chemical_id){
        return $this->chemicalsModel->find($chemical_id);
    }
    public function getChemicals(){
        return DB::table('chemical')
                    ->where('chemical_is_deleted','=','0')
                    ->orderBy('chemical_name','asc')
                    ->get();
    }

}