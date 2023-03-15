<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

use App\Services\UserService;

class UserController extends Controller
{
    public function __construct(){
        $this->userService = new UserService();
    }
    public function getContractorsList(){
        return $this->userService->getContractorsList();
    }
    public function getCrewTreaterList(){
        return $this->userService->getCrewTreaterList();
    }
    public function getCrewListSpec(){
        return $this->userService->getCrewListSpec();
    }
    public function getUsersList() {
        return $this->userService->getUsersList();
    }
}
