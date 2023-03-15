<?php
namespace App\Services;

use App\Models\CardDetails;

class CardDetailsService
{
	function __construct()
	{
        $this->card = new CardDetails();
    }
    public function save($data){
        $card = new $this->card;
        $result = $card->create($data);
        return $result->id;
    }
    public function cardList($clientId)
    {
        return $this->card::where('client_id',$clientId)->where('is_delete',0)->get();
    }
    public function cardDelete($id)
    {
        // return $this->card::where('id',$clientId)->where('is_delete',0)->get();
        $client = $this->card->find($id);
        if($client){
            $client->is_delete = 1;
            $client->save();
        }
        return $id;
    }
    public function findCard($id)
    {
        $client = $this->card->find($id);
        if($client){
            return $client;
        }
    }


    public function getCardForPayment($paymentProfileId, $clientId){
        return $this->card
        ->where('payment_profile_id', $paymentProfileId)
        ->where('client_id', $clientId)
        ->where('is_delete',0)
        ->first();
    }

    

    

}