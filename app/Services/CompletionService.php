<?php

namespace App\Services;


class CompletionService {

	public $findings;

	public function initCompletion($findings){
		$this->findings = $findings;
	}

}