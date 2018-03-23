// ------------------------------------- UTILITY FUNCTIONS ------------------------------------- //
//Replace a character at a given index in a string
//from http://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
//called in functions: @enCaesar, @deCaesar, @enVigenere, @deVigenere
String.prototype.replaceAt=function(index, character) {
	return this.substr(0, index) + character + this.substr(index+character.length);
}

//Get sum of all numbers in array of numbers
//suggestion from https://github.com/steveosoule
//called in functions: @crackCaesar
Array.prototype.sumVal=function(){
	return(this.reduce(function(a, b) {return a + b;}))
}

//get the index of all occurences of substr in string
//from http://stackoverflow.com/questions/16897772/looping-through-string-to-find-multiple-indexes
//called in functions: @crackCaesar
function getMatchIndexes(str, toMatch) {
    var toMatchLength = toMatch.length,
        indexMatches = [], match,
        i = 0;

    while ((match = str.indexOf(toMatch, i)) > -1) {
        indexMatches.push(match);
        i = match + toMatchLength;
    }

    return indexMatches;
}



//input str - string - to be decoded
//input shift - integer - to shift by
//return - string - decoded string
function deCaesar(str,shift) {
	//str - string to be decrypted
	//shift - number 1 - 25 to shift letters to show decoded message
	for (var i = 0, len = str.length; i < len; i++) {//for each char in string
		for (var j = 0, len2 = shift; j < len2; j++) {//decrement one at a time (easier to loop at a)
			if (str[i].match(/^[b-zB-Z]*$/gi) != null  ) {
				str = str.replaceAt(i, String.fromCharCode(str[i].charCodeAt(0) - 1));//decrement char by 1
			}
			else if (str[i].match(/^[aA]*$/) !== null) {
				str = str.replaceAt(i, String.fromCharCode(str[i].charCodeAt(0) + 25));//if a circle back to z
			}
		}
	}
	return str;
}

//input str - string - to be cracked
//return - integer - best guess in shift - use in deCeasar to return decrypted

exports.crackCaesar = function crackCaesar(str) {
	str = str.toLowerCase();//make the str easier to work with, we aren't returning it
	var allCharFreq = [];//hold the character frequency of all possible ceasar shifts
	var charCount = str.replace(/[^a-z]/gi, '').length;//number of a-z chars
	//baseCharFreq becomes an array of the expected character frequency of the solution, by multiplying the charCount by the percentage that letter is used in average english (a is 8%, b is 1.5% etc)
	var baseCharFreq = [charCount*.08,charCount*.015,charCount*.025,charCount*.044,charCount*.126,charCount*.024,charCount*.02,charCount*.063,charCount*.07,charCount*.0014,charCount*.0074,charCount*.04,charCount*.025,charCount*.07,charCount*.076,charCount*.018,charCount*.001,charCount*.06,charCount*.063,charCount*.08,charCount*.028,charCount*.009,charCount*.02,charCount*.0017,charCount*.02,charCount*.0008,];
	for (var j = 0; j < baseCharFreq.length; j++) {//26 times we caesar shift str by 1 and count char freq. char freq is pushed to allCharFreq
		var charFreq = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		var array = []
		for (var i = 0, len = str.length; i < len; i++) {
			if (str[i].match(/^[a-y]*$/gi) !== null) {
				array.push(String.fromCharCode(str[i].charCodeAt(0) + 1));
				charFreq[str[i].charCodeAt(0)-96]++;
			}
			else if (str[i].match(/^[z]*$/) !== null) {
				array.push(String.fromCharCode(str[i].charCodeAt(0) - 25));
				charFreq[0]++;
			}
			else if (str[i].match(/[^a-z]/i) !== null ) {
				array.push(str[i]);
			}
		}
		str = array.join('');
		allCharFreq.push(charFreq);
	}
	var resultCharFreq = [];//this will hold the difference between actual and expected for each iteration, the one with least difference we assume is the solution (closest to avg english)
	for (var k = 0; k < allCharFreq.length; k++) {//for each char freq, compare it to baseline and get difference
		var indResultCharFreq = [];
		for (var l = 0; l < allCharFreq[k].length; l++) {
			indResultCharFreq[l] =  Math.abs(allCharFreq[k][l] - baseCharFreq[l]);
		}
		resultCharFreq.push(indResultCharFreq.sumVal());
	}
	return 26-((resultCharFreq.indexOf(Math.min.apply(Math,resultCharFreq)))+1);//return 26 - index of lowest difference (the + 1 to account for 0 indexed arrays) you can deCaesar by this return to get decrypted message
}

//input str - string - to be encoded
//input shift - string - to shift by
//return - string - encoded string
function enVigenere(str,key) {
	key = key.toLowerCase();//make the key easier to work with
	while (key.length < str.length) {//extend the key longer than our string by appending it to itself
		key = key + key;
	}
	for (var i = 0, len = str.length; i < len; i++) {//for each letter in string
		if (str[i].match(/^[a-zA-Z]*$/gi) === null  ) {
			key = key.substr(0, i) + ' ' + key.substr(i);//if the letter in string isn't a-z or A-Z we insert a space at this spot in key, to preserve the key shift for the next real letter
		}
		var shift = key[i].charCodeAt(0)-96;//get our shift amount, if it is a space it will be negative, and the for loop won't run on this turn and the character is unchanged
		for (var j = 0; j < shift; j++) {//caesar shift the letter by shift amount
			if (str[i].match(/^[a-yA-Y]*$/gi) !== null  ) {
				str = str.replaceAt(i, String.fromCharCode(str[i].charCodeAt(0) + 1));
			}
			else if (str[i].match(/^[zZ]*$/gi) !== null  ) {
				str = str.replaceAt(i, String.fromCharCode(str[i].charCodeAt(0) - 25));
			}
		}
	}
	return str;
}

//input str - string - to be decoded
//input shift - string - to shift by
//return - string - decoded string
function deVigenere(str,key) {
	key = key.toLowerCase();//make the key easier to work with
	while (key.length < str.length) {//extend the key longer than our string by appending it to itself
		key = key + key;
	}
	for (var i = 0, len = str.length; i < len; i++) {//for each letter in string
		if (str[i].match(/^[a-zA-Z]*$/gi) === null  ) {
			key = key.substr(0, i) + ' ' + key.substr(i);//if the letter in string isn't a-z or A-Z we insert a space at this spot in key, to preserve the key shift for the next real letter
		}
		var shift = key[i].charCodeAt(0)-96;//get our shift amount, if it is a space it will be negative, and the for loop won't run on this turn and the character is unchanged
		for (var j = 0, len2 = shift; j < len2; j++) {//reverse caesar shift the letter by shift amount
			if (str[i].match(/^[b-zB-Z]*$/gi) !== null  ) {
				str = str.replaceAt(i, String.fromCharCode(str[i].charCodeAt(0) - 1));
			}
			else if (str[i].match(/^[aA]*$/gi) !== null  ) {
				str = str.replaceAt(i, String.fromCharCode(str[i].charCodeAt(0) + 25));
			}
		}
	}
	return str;
}

//input str - string - to be analyzed
//return - float - index of coincidence of str
//code from http://practicalcryptography.com/cryptanalysis/text-characterisation/index-coincidence/
//idea from http://www.nku.edu/~christensen/1402%20Friedman%20test%202.pdf
function getIC(str) {
    str = str.toLowerCase().replace(/[^a-z]/g, "");
    var counts = new Array(26);
    var totcount=0;
    for(i=0; i<26; i++) counts[i] = 0;
    for(i=0; i<str.length; i++){
        counts[str.charCodeAt(i) - 97]++;
        totcount++;
    }
    var sum = 0;
    for(i=0; i<26; i++) sum = sum + counts[i]*(counts[i]-1);
    ic = sum / (totcount*(totcount-1));
    return ic;
}

//input str - string - to be cracked
//input keyLen - integer - length of key (no spaces or spec char) 
//return - array - [best guess at the key based on freq analysis, index of coincidence]
function keyLenVigenere(str,keyLen) {
	var arr = [];
	str = str.replace(/[^a-z]/gi, '');//clean string to make it easier, we don't return it here, just the key, so why preserve it?
	//these for loops split the string in to *keyLen* strings by getting every *keyLen* letter. 
	//for example: 'hello world!' keyLen 3 is split to ['hlod', 'eor', 'lwl'] -- 'hlod' is the first, fourth, seventh and tenth char of 'helloworld'
	//so it split the string in to *3* strings by getting every *3*rd letter, get it?
	//we do this because if the key length is 3, those groups are encoded with the same letter of the string, so we can crackCaesar them down below
	for (var i = 0; i < keyLen; i++) {
		for (var j = i; j < str.length; j+=keyLen) {
			if (arr[i] !== undefined) {
				arr[i] = arr[i] + str[j];
			}
			else {
				arr[i] = str[j];
			}
		}
	}
	var results = [];
	var icResults = [];
	for (var k = 0, len = arr.length; k < len; k++) {//crack caesar on each group, capture char code of answer and return the key that they make
		icResults.push(getIC(arr[k]));
		results[k] = String.fromCharCode(crackCaesar(arr[k])+96);
	}
	var icAvg = icResults.sumVal()/icResults.length;
	return [results.join(''), icAvg];
}

//input str - string - to look for words
//return - integer - number of top 1000 words matched in string
function wordMatchr(str) {
	str = str.replace(/[^a-z]/gi, '').toLowerCase();//clean the string. This makes false positives more common, but allows us to effectively search if the spaces are broken up incorrectly 
	var mostCommon = ['the','of','to','and','a','in','is','it','you','that','he','was','for','on','are','with','as','I','his','they','be','at','one','have','this','from','or','had','by','hot','word','but','what','some','we','can','out','other','were','all','there','when','up','use','your','how','said','an','each','she','which','do','their','time','if','will','way','about','many','then','them','write','would','like','so','these','her','long','make','thing','see','him','two','has','look','more','day','could','go','come','did','number','sound','no','most','people','my','over','know','water','than','call','first','who','may','down','side','been','now','find','any','new','work','part','take','get','place','made','live','where','after','back','little','only','round','man','year','came','show','every','good','me','give','our','under','name','very','through','just','form','sentence','great','think','say','help','low','line','differ','turn','cause','much','mean','before','move','right','boy','old','too','same','tell','does','set','three','want','air','well','also','play','small','end','put','home','read','hand','port','large','spell','add','even','land','here','must','big','high','such','follow','act','why','ask','men','change','went','light','kind','off','need','house','picture','try','us','again','animal','point','mother','world','near','build','self','earth','father','head','stand','own','page','should','country','found','answer','school','grow','study','still','learn','plant','cover','food','sun','four','between','state','keep','eye','never','last','let','thought','city','tree','cross','farm','hard','start','might','story','saw','far','sea','draw','left','late','run','dont','while','press','close','night','real','life','few','north','open','seem','together','next','white','children','begin','got','walk','example','ease','paper','group','always','music','those','both','mark','often','letter','until','mile','river','car','feet','care','second','book','carry','took','science','eat','room','friend','began','idea','fish','mountain','stop','once','base','hear','horse','cut','sure','watch','color','face','wood','main','enough','plain','girl','usual','young','ready','above','ever','red','list','though','feel','talk','bird','soon','body','dog','family','direct','pose','leave','song','measure','door','product','black','short','numeral','class','wind','question','happen','complete','ship','area','half','rock','order','fire','south','problem','piece','told','knew','pass','since','top','whole','king','space','heard','best','hour','better','true .','during','hundred','five','remember','step','early','hold','west','ground','interest','reach','fast','verb','sing','listen','six','table','travel','less','morning','ten','simple','several','vowel','toward','war','lay','against','pattern','slow','center','love','person','money','serve','appear','road','map','rain','rule','govern','pull','cold','notice','voice','unit','power','town','fine','certain','fly','fall','lead','cry','dark','machine','note','wait','plan','figure','star','box','noun','field','rest','correct','able','pound','done','beauty','drive','stood','contain','front','teach','week','final','gave','green','oh','quick','develop','ocean','warm','free','minute','strong','special','mind','behind','clear','tail','produce','fact','street','inch','multiply','nothing','course','stay','wheel','full','force','blue','object','decide','surface','deep','moon','island','foot','system','busy','test','record','boat','common','gold','possible','plane','stead','dry','wonder','laugh','thousand','ago','ran','check','game','shape','equate','hot','miss','brought','heat','snow','tire','bring','yes','distant','fill','east','paint','language','among','grand','ball','yet','wave','drop','heart','am','present','heavy','dance','engine','position','arm','wide','sail','material','size','vary','settle','speak','weight','general','ice','matter','circle','pair','include','divide','syllable','felt','perhaps','pick','sudden','count','square','reason','length','represent','art','subject','region','energy','hunt','probable','bed','brother','egg','ride','cell','believe','fraction','forest','sit','race','window','store','summer','train','sleep','prove','lone','leg','exercise','wall','catch','mount','wish','sky','board','joy','winter','sat','written','wild','instrument','kept','glass','grass','cow','job','edge','sign','visit','past','soft','fun','bright','gas','weather','month','million','bear','finish','happy','hope','flower','clothe','strange','gone','jump','baby','eight','village','meet','root','buy','raise','solve','metal','whether','push','seven','paragraph','third','shall','held','hair','describe','cook','floor','either','result','burn','hill','safe','cat','century','consider','type','law','bit','coast','copy','phrase','silent','tall','sand','soil','roll','temperature','finger','industry','value','fight','lie','beat','excite','natural','view','sense','ear','else','quite','broke','case','middle','kill','son','lake','moment','scale','loud','spring','observe','child','straight','consonant','nation','dictionary','milk','speed','method','organ','pay','age','section','dress','cloud','surprise','quiet','stone','tiny','climb','cool','design','poor','lot','experiment','bottom','key','iron','single','stick','flat','twenty','skin','smile','crease','hole','trade','melody','trip','office','receive','row','mouth','exact','symbol','die','least','trouble','shout','except','wrote','seed','tone','join','suggest','clean','break','lady','yard','rise','bad','blow','oil','blood','touch','grew','cent','mix','team','wire','cost','lost','brown','wear','garden','equal','sent','choose','fell','fit','flow','fair','bank','collect','save','control','decimal','gentle','woman','captain','practice','separate','difficult','doctor','please','protect','noon','whose','locate','ring','character','insect','caught','period','indicate','radio','spoke','atom','human','history','effect','electric','expect','crop','modern','element','hit','student','corner','party','supply','bone','rail','imagine','provide','agree','thus','capital','wont','chair','danger','fruit','rich','thick','soldier','process','operate','guess','necessary','sharp','wing','create','neighbor','wash','bat','rather','crowd','corn','compare','poem','string','bell','depend','meat','rub','tube','famous','dollar','stream','fear','sight','thin','triangle','planet','hurry','chief','colony','clock','mine','tie','enter','major','fresh','search','send','yellow','gun','allow','print','dead','spot','desert','suit','current','lift','rose','continue','block','chart','hat','sell','success','company','subtract','event','particular','deal','swim','term','opposite','wife','shoe','shoulder','spread','arrange','camp','invent','cotton','born','determine','quart','nine','truck','noise','level','chance','gather','shop','stretch','throw','shine','property','column','molecule','select','wrong','gray','repeat','require','broad','prepare','salt','nose','plural','anger','claim','continent','oxygen','sugar','death','pretty','skill','women','season','solution','magnet','silver','thank','branch','match','suffix','especially','fig','afraid','huge','sister','steel','discuss','forward','similar','guide','experience','score','apple','bought','led','pitch','coat','mass','card','band','rope','slip','win','dream','evening','condition','feed','tool','total','basic','smell','valley','nor','double','seat','arrive','master','track','parent','shore','division','sheet','substance','favor','connect','post','spend','chord','fat','glad','original','share','station','dad','bread','charge','proper','bar','offer','segment','slave','duck','instant','market','degree','populate','chick','dear','enemy','reply','drink','occur','support','speech','nature','range','steam','motion','path','liquid','log','meant','quotient','teeth','shell','neck'];//from https://gist.github.com/deekayen/4148741\
	var occurrences = 0;
	for (var i = 0, len = mostCommon.length; i < len; i++) {
		if (str.indexOf(mostCommon[i].toLowerCase()) > -1) {
			occurrences++;
		}
	}
	return occurrences;
}

//input str - string - to be cracked
//return - array of objects - cointaining guesses based on observed repetition lengths run through @keyLenVigenere and then added if index of coincidence is greater than 6 (avg english is ~6.7)
function crackVigenere(str) {
	console.time('time');
	var repeated = [];
	var justLetters = str.replace(/[^a-z]/gi, '');
	var cap = 100;//decrease this for better performance, but perhaps less reliable results (needs testing)
	if (justLetters.length < 100) {
		cap = justLetters.length;
	}
	//build an array of repeated substrings from 4 characters long to *cap* characters long
	for (var j = 4; j < cap; j++) {
		for (var i = 0; i < justLetters.length; i++) {
			if (getMatchIndexes(justLetters,justLetters.substring(i,i+j)).length > 1 && i+j < justLetters.length) {
				if (repeated.indexOf(justLetters.substring(i,i+j)) === -1) {
					repeated.push(justLetters.substring(i,i+j));
				}
			}
		}
	}

	//for each repeated string, get the length between the first and second occurences
	var differences = [];
	for (var k = 0; k < repeated.length;) {
		var matchIndexes = getMatchIndexes(justLetters,repeated[repeated.length-1]);
		if (differences.indexOf(matchIndexes[1]-matchIndexes[0]) === -1) {
			differences.push(matchIndexes[1]-matchIndexes[0]);
		}
		repeated.pop();
	}

	//for each difference length, find some divisors in case we're missing them
	for (var l = 0; l < differences.length; l++) {
		for (var m = 2 ; m < 11; m++) {
			if(differences[l] % m === 0 && differences[l]/m > 1 && differences.indexOf(differences[l]/m) === -1) {
				differences.push(differences[l]/m)
			}
		}
	}

	if (differences.length === 0) {
		differences = [0,1,2,3,4,5,6,7,8,9,10];//if we couldn't find any repeats we need something to work with
	}

	//sort the array of possible key lengths and add the lowest 20 to an array of objects
	differences.sort(function(a, b){return a-b});
	var solutionsObj = [];
	if (differences.length < 100) {
		var repeats = differences.length;
	}
	else {
		var repeats = 100;
	}
	//for the differences, do @keyLenVigenere and if index of coincidence is greater than .06 add an object to be returned
	for (var z = 0; z < repeats; z++) {
		var keyyArr = keyLenVigenere(str,differences[z]);
		var keyy = keyyArr[0];
		var ic = keyyArr[1];
		if (ic > 0.06) {
			var thisMsg = deVigenere(str,keyy);
			solutionsObj.push(
				{
					'key':keyy,
					'ic':ic,
					'message':thisMsg,
					'wordmatches':wordMatchr(thisMsg)
				}
			);
		};
	}
	//sort resulting objects by highest wordmatches
	solutionsObj.sort(function(a, b){
	    if(a.wordmatches < b.wordmatches) return 1;
	    if(a.wordmatches > b.wordmatches) return -1;
	    if(a.wordmatches == b.wordmatches) {
	    	if((a.key).length < (b.key).length)	return -1;
	    	if((a.key).length > (b.key).length) return 1;   		
	    }
	    return 0;
	});
	console.timeEnd('time');
	return solutionsObj;
}
