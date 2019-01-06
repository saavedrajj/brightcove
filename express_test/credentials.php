<?php
		/*** Settings **********************************************************************************************/
		$production = true;
		switch ($production) {
			case true:
			# Customer Credentials **********
			$accountId = "2540076170001"; 
			$clientId     = "c3e5360f-e2b5-451d-ad0a-ea71bdd16ced";
			$clientSecret = "bTKusj-QyfGhNC0ILPmv2t4_nWOt2GtGJyCbekICzAC50tomjWnVaqCTOtqzaTtZJi6NF5EOe_sxZ7-_W_-q6A";
			break;
			case false:
			# Test Credentials ************			
			$accountId = "5458602755001"; 
			$clientId     = "39e632c6-3419-40f1-a373-36ea579cce5a";
			$clientSecret = "wT9-dw2XyGl1yG_e5UdsTDfK8ELGrAdRzr8WFeRqltDztf3b_PewibmnMR_EcE3FuYV3D8HQU32w1z2QyLJ9Dw";
			break;
		}
?>