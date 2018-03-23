const fs = require('fs');

var inquirer = require("inquirer");
var argv = require('minimist')(process.argv.slice(2));
var from, destination;
var e, d = false;
var key, message = "";
var encrypted = {
	key, message, destination
}


console.dir(argv);

if ((argv.k && argv._) && (argv.e == true || argv.d == true) && argv._[0] && (argv._[1] != undefined)) {
	e = argv.e
	encrypted.key = argv.k
	encrypted.destination = argv._[1].toString()
	from = argv._[0].toString()


	if (argv.k < 0 || argv.k > 25) {
		console.log("K deve estar entre 0 e 25")
	} else {
		fs.readFile(from, function read(err, data) {
			if (err) {
				throw err;
			}
			caesar(data)
		});
	}
} else {
	console.log("Não informastes todos os argumentos ou informastes na ordem incorreta.\n Siga o padrão cesar -c -k numeroDeCifragem  texto-original.txt  texto-modificado.txt")
}


function caesar(data) {
	hex2a(data.toString())
	encrypted.message = data.toString();
	if (e) {
		console.log("Modo : cifragem")
	}
	else {
		console.log("Modo : decifragem")
	}
	if (argv.e == true) {
		x = encrypted
		encrypted.message = encrypt(x)
		console.log(encrypted.message)
	} else {
		x = encrypted
		console.log(desencrypt(x))
		// hex2a(
	}
}
function encrypt(encrypted) {
	var newMessage = '';

	if (encrypted.key < 0) {
		reverseEncryption(encrypted);

	} else {

		console.log("Código de cifragem " + encrypted.key)


		for (var i = 0; i < encrypted.message.length; i++) {

			var newKey = encrypted.message[i];
			var newCode = encrypted.message.charCodeAt(i);

			if ((newCode >= 65) && (newCode <= 90)) {
				newKey = String.fromCharCode(((newCode - 65 + encrypted.key) % 26) + 65);
			} else if ((newCode >= 97) && (newCode <= 122)) {
				newKey = String.fromCharCode(((newCode - 97 + encrypted.key) % 26) + 97);
			}
			newMessage += newKey;
		}
	}
	fs.writeFile(encrypted.destination, newMessage, function (err) {
		if (err) {
			return console.log(err);
		}

		console.log("O arquivo foi salvo!");
	});
}
function desencrypt(encrypted) {
	var newMessage = '';

	console.log("Código de cifragem" + encrypted.key)

	console.log("\nMessagem: " + encrypted.message)
	for (var i = 0; i < encrypted.message.length; i++) {

		var newKey = encrypted.message[i];
		var newCode = encrypted.message.charCodeAt(i);

		if ((newCode >= 65) && (newCode <= 90)) {
			newKey = String.fromCharCode(((newCode - 65 - encrypted.key) % 26) + 65);
		} else if ((newCode >= 97) && (newCode <= 122)) {
			newKey = String.fromCharCode(((newCode - 97 - encrypted.key) % 26) + 97);
		}
		//}
		newMessage += newKey;
	}
	fs.writeFile(encrypted.destination, newMessage, function (err) {
		if (err) {
			return console.log(err);
		}

		console.log("O arquivo foi salvo!");
	});

}

function hex2a(hexx) {
	var hex = hexx.toString();//force conversion
	var str = '';
	for (var i = 0; i < hex.length; i += 5)
		str += String.fromCharCode(parseInt(hex.substr(i, 4), 16));
	return str;
}
