<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Services\ChemicalsService;

class ChemicalsController extends Controller
{
    public function __construct(){
        $this->chemicalService = new ChemicalsService();
    }
    public function getChemicalUnit($chemical_id){
        return $this->chemicalService->getChemicalUnit($chemical_id);
    }
    public function getChemicals(){
        return $this->chemicalService->getChemicals();
    }
}
