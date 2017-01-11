console.log('starting password manager');
var crypto = require('crypto-js');
var storage = require ('node-persist');
storage.initSync();

var argv = require ('yargs')
	.command('create', 'Create a new account', function(yargs){
		yargs.options({
			name: {
				demand: true,
				alias: 'n',
				description: 'Account name (eg: Twitter, Facebook)',
				type: 'string'
			},
			username: {
				demand: true,
				alias: 'u',
				description: 'Account username or email',
				type: 'string'
			},
			password: {
				demand: true,
				alias: 'p',
				description: 'Account password',
				type: 'string'
			},
			masterPassword: {
				demand: true,
				alias: 'm',
				description: 'master password',
				type: 'string'
			}
		}).help('help');
	})
	.command('get', 'Get an existing account', function(yargs){
		yargs.options({
			name: {
				demand: true,
				alias: 'n',
				description: 'Account name (eg: Twitter, Facebook)',
				type: 'string'
			},
			masterPassword: {
				demand: true,
				alias: 'm',
				description: 'master password',
				type: 'string'
			}
		}).help('help');
	})
	.help('help')
	.argv;

var command = argv._[0];

function getAccounts(masterPassword){
	var encryptedAccount = storage.getItemSync('accounts');
	var accounts=[];
	if (typeof encryptedAccount !== 'undefined'){
		var bytes = crypto.AES.decrypt(encryptedAccount, masterPassword);
		var accounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
	}
	return accounts;
}

function saveAccounts(accounts, masterPassword){
	var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);
	storage.setItemSync('accounts', encryptedAccounts.toString());
	return accounts;
}

function createAccount (account, masterPassword){
	var accounts = getAccounts(masterPassword);
	
	accounts.push(account);
	saveAccounts(accounts, masterPassword);
	return account;
}

function getAccount (accountName, masterPassword){
	var accounts = getAccounts(masterPassword);
	var matachedAccount; 
	accounts.forEach(function(account) {
		if( account.name === accountName)
		{
			matachedAccount = account;
		}
	});
	return matachedAccount;
}


if(command === 'create'){
	try{
		var createdAccount = createAccount({
			name: argv.name,
			username: argv.username,
			password: argv.password
		}, argv.masterPassword);
		console.log('Account created!');
		console.log(createdAccount);
	} catch (e){
		console.log('Unable to create account.');
	}
}else if ( command === 'get'){
	try {
		var fetchedAccount = getAccount(argv.name, argv.masterPassword);
		if (typeof fetchedAccount === 'undefined'){
			console.log('Account is not found!');
		} else{
			console.log('Account found!');
			console.log(fetchedAccount);
		} 
	} catch(e){
		console.log('Unable to fetch account.');
	}
}
