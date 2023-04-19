<?php
// Get the selected song and the wallet balance from the form
$song = $_POST['song_select'];
$wallet_balance = $_POST['wallet_balance'];

// Calculate the maximum amount that can be funded for the campaign
$max_fund = $wallet_balance / 2;

// Get the campaign fund from the form and validate it
$campaign_fund = $_POST['campaign_fund'];
if ($campaign_fund > $max_fund) {
	echo "Error: Campaign fund cannot be greater than half of wallet balance.";
	exit();
}

// Create the campaign and deduct the campaign fund from the wallet balance
$campaign_name = $song . "_campaign";
$new_wallet_balance = $wallet_balance - $campaign_fund;
echo "Campaign \"$campaign_name\" has been created with a fund of $campaign_fund. Your new wallet balance is $new_wallet_balance.";
?>
-----