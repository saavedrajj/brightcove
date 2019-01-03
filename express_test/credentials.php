<?php
		/*** customer settings *************************************************************************************/
		$production = true;
		switch ($production) {
			case true:
			/* Express Newspaper Credentials */
			$account_id = "2540076170001"; 
			$client_id     = "c3e5360f-e2b5-451d-ad0a-ea71bdd16ced";
			$client_secret = "bTKusj-QyfGhNC0ILPmv2t4_nWOt2GtGJyCbekICzAC50tomjWnVaqCTOtqzaTtZJi6NF5EOe_sxZ7-_W_-q6A";
			break;
			case false:
			/* Test Credentials */			
			$account_id = "5458602755001"; 
			$client_id     = "39e632c6-3419-40f1-a373-36ea579cce5a";
			$client_secret = "wT9-dw2XyGl1yG_e5UdsTDfK8ELGrAdRzr8WFeRqltDztf3b_PewibmnMR_EcE3FuYV3D8HQU32w1z2QyLJ9Dw";
			break;
		}

		$auth_string   = "{$client_id}:{$client_secret}";
		$bc_token = base64_encode($auth_string);

?>