/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
var session = require('express-session');
//var session = require('express-session');
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname + '/public'));
//Create Database Connection
var pgp = require('pg-promise')();


// Cookie stuff
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 6000000 }
}));

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.
		We'll be using `db` as this is the name of the postgres container in our
		docker-compose.yml file. Docker will translate this into the actual ip of the
		container for us (i.e. can't be access via the Internet).
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab,
		we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database. We set this in the
		docker-compose.yml for now, usually that'd be in a seperate file so you're not pushing your credentials to GitHub :).
**********************/
const dbConfig = {
	host: 'db',
	port: 5432,
	database: 'snaktrak_db',
	user: 'snakker',
	password: 'pwd'
};

var db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory

function calculateBalance(members, foodItems, memberId){
  var payData = {
    roommates: []
  };
  //loop through rest of roommates
  for (let i = 0; i < members.length; i++){
    if (members[i].member_id == memberId){
      continue;
    } else {
      var amountOwed = 0;
      var roommate_member_id = members[i].member_id;
      var roommate_name = members[i].username;

      //loop through times where user ate someone elses foood
      for (let j = 0; j < foodItems.length; j++){
        if (foodItems[j].eater == memberId && foodItems[j].provider == roommate_member_id){
          amountOwed -= foodItems[j].price;
        }
        else {
          continue;
        }
      }
      //loop through times where someone else ate users food
      for (let j = 0; j < foodItems.length; j++){
        if (foodItems[j].provider == memberId && foodItems[j].eater == roommate_member_id){
          amountOwed += foodItems[j].price;
        }
        else {
          continue;
        }
      }
      if (amountOwed < 0) {
        var owe = true;
      } else {
        var owe = false;
      }
      payData.roommates.push({
        name: roommate_name,
        price: amountOwed,
        negorpos: owe
      });
    }
  }
  return payData;
}

// GET requests

// home page
app.get('/', function(req, res) {
	res.render('pages/landing_page',{
		my_title:"Home"
	});
});

app.get('/landing_page', function(req, res) {
	res.render('pages/landing_page',{
		my_title:"Home"
	});
});

// home page
app.get('/', function(req, res) {
	res.render('pages/landing_page',{
		my_title:"Home"
	});
});

// login page (render)
app.get('/login', function(req, res) {
	res.render('pages/login',{
		my_title:"Login",
		data: '',
		email: '',
		password: '',
		matching: ''
	});
});

// register page
app.get('/register', function(req, res) {
	res.render('pages/register', {
		my_title: "Register",
		data: '',
		email: '',
		password: '',
		household: 0,
		register_requirements: ''
	})
});

// dashboard page
app.get('/dashboard', function(req, res) {
	var fridgeQuery = "SELECT * from Fridge WHERE household_id="+ req.session.household_id +";";

  //balance wheel queries
  var feedQuery = `SELECT * FROM Feed WHERE household_id=` + req.session.household_id + `;`;
  var memberQuery = `SELECT * FROM Members WHERE household_id=` + req.session.household_id + `;`;
  var memberName = `SELECT username FROM Members WHERE memberId=`+ req.session.member_id +`;`;
	db.task('get-everything', task => {
		return task.batch([
			task.any(fridgeQuery),
      task.any(feedQuery),
      task.any(memberQuery),
		]);
	})
	.then(data => {
    var payData = calculateBalance(data[2], data[1], req.session.member_id);
		res.render('pages/dashboard',{
			my_title: "Dashboard",
			fridge: data[0],
      		balances: payData,
			member: req.session.member_id
		})

	})
	.catch(err => {
		console.log('error', err);
		res.render('pages/dashboard', {
			my_title: 'Dashboard',
			fridge: '',
      		balances: '',
			member: ''
		})
	})
});

app.post('/dashboard/add_food', function(req, res) {
	var name = req.body.itemName;
	var quantity = req.body.quantity;
	var price = req.body.price;
  var memberId = req.session.member_id;
	var insert_statement = `INSERT INTO Fridge(
    member_id,
		food_item,
		quantity,
		price,
		household_id
	   )
	   VALUES(` + memberId +`,'`+name+`',`+ quantity +`,`+ price + `,` + req.session.household_id +`);`;
	   var fridgeQuery = "SELECT * from Fridge WHERE household_id="+ req.session.household_id + ";";

     //balance wheel queries
     var feedQuery = `SELECT * FROM Feed WHERE household_id=` + req.session.household_id + `;`;
     var memberQuery = `SELECT * FROM Members WHERE household_id=` + req.session.household_id + `;`;
     var memberName = `SELECT username FROM Members WHERE memberId=`+ req.session.member_id +`;`;

	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
			      task.any(fridgeQuery),
            task.any(feedQuery),
            task.any(memberQuery)
        ]);
    })
    .then(data => {
      var payData = calculateBalance(data[3], data[2], req.session.member_id);
    	res.render('pages/dashboard',{
				my_title: "Dashboard",
				fridge: data[1],
       			balances: payData,
				member: req.session.member_id
			})
    })
    .catch(err => {
            console.log('error', err);
            res.render('pages/dashboard', {
				my_title: 'Dashboard',
				data: '',
				fridge: '',
        		balances: '',
				member: ''

            })
    });
});

app.post('/dashboard/eat_food', function(req, res) {
	var id = req.body.food_id;
	var select_statement = `SELECT * FROM Fridge WHERE item_id=`+id+`;`;
	var quantity = 0;
	var price = 0;
	var member_id = "";
  	var food_name = "";

  //balance wheel queries
  var feedQuery = `SELECT * FROM Feed WHERE household_id=` + req.session.household_id + `;`;
  var memberQuery = `SELECT * FROM Members WHERE household_id=` + req.session.household_id + `;`;
  var memberName = `SELECT username FROM Members WHERE memberId=`+ req.session.member_id +`;`;

	db.task('select_item_from_fridge', task => {
        return task.batch([
            task.any(select_statement)
        ]);
    })
    .then(data => {
        	//console.log(data);
    		//console.log("Desired value:" + data[0][0].quantity);
    		  quantity = data[0][0].quantity;
    		  price = data[0][0].price;
    		  member_id = data[0][0].member_id;
          	  food_name = data[0][0].food_item;


    		var update_statement = "";
    		if (quantity == 1)
    		{
    			update_statement = `DELETE FROM Fridge WHERE item_id=`+id+`;`;
    		}
    		else
    		{
    			quantity = quantity - 1;
    			console.log("Updated quantity:" + quantity);
    			update_statement = `UPDATE Fridge SET quantity=`+quantity+` WHERE item_id=`+id+`;`;
    		}

        //statement to insert into feed
        var insert_feed_statement = `INSERT INTO Feed(household_id, item_id, food_item, eater, provider, price)
      	   VALUES(`+ req.session.household_id +`,`+ id +`,'`+ food_name + `',` + req.session.member_id + `,` + member_id + `,` + price +`);`;


    		var fridgeQuery = "SELECT * from Fridge WHERE household_id=" + req.session.household_id + ";";
        //make sure the update queries run before pulling from database again
    		db.task('get-everything', task => {
    			return task.batch([
    				task.any(update_statement),
            task.any(insert_feed_statement)
    			]);
    		})
    		.then(info => {
          //THEN do the selects from the tables
          db.task('select_from_bunch_of_tables', task => {
                return task.batch([
                    task.any(fridgeQuery),
                    task.any(feedQuery),
                    task.any(memberQuery)
                ]);
            })
            .then(info => {
              var payData = calculateBalance(info[2], info[1], req.session.member_id)
    			    console.log("Test fridge data: " + info[0]);
    			       res.render('pages/dashboard',{
    				           my_title: "Dashboard",
    				           fridge: info[0],
    				           balances: payData,
							   member: req.session.member_id
    			       })
    		     })
        })
  })


});

app.post('/dashboard/clear_balance', function(req, res) {
	var deleteQuery = `DELETE FROM Feed WHERE household_id=`+ req.session.household_id +`;`;
  var fridgeQuery = "SELECT * from Fridge WHERE household_id="+ req.session.household_id +";";

  //balance wheel queries
	db.task('get-everything', task => {
		return task.batch([
			task.any(deleteQuery),
     		 task.any(fridgeQuery)
		]);
	})
	.then(data => {
		res.render('pages/dashboard',{
			my_title: "Dashboard",
      		balances: '',
      		fridge: data[1],
			member: req.session.member_id
		})

	})
	.catch(err => {
		console.log('error', err);
		res.render('pages/dashboard', {
			my_title: 'Dashboard',
			fridge: '',
      		balances: '',
			member: ''
		})
	})
});

//Post Requests

app.post('/register', function(req, res) {
	var member_email_variable = req.body.member_email;
	var member_password_variable = req.body.member_password;
	var confirm_member_password_variable = req.body.confirm_member_password;
	var member_household_id_variable = req.body.member_household_id;
	var query = 'select * from Members;';
	var insert_statement = "INSERT INTO Members(username, password, household_id) VALUES('" + member_email_variable + "', '" + member_password_variable + "', " + member_household_id_variable + ");";
	var register_requirements = false;

	db.task('get-everything', task => {
		return task.batch([
			task.any(insert_statement)
		]);
	})
	.then(info => {
		if(member_email_variable != "" && member_password_variable == confirm_member_password_variable && member_password_variable.length >= 8 && /\d/.test(member_password_variable) && /(?=.*[A-Z])/.test(member_password_variable)) {
			register_requirements = true;
		}
		if(register_requirements == true) {
			res.render('pages/login', {
				my_title: "Login",
				data: info,
				email: member_email_variable,
				password: member_password_variable,
				household: member_household_id_variable,
				register_requirements: 'Registration successful',
				fridge: '',
				balances: '',
				matching: ''

			})
		}
		else {
			res.render('pages/register', {
				my_title: "Register",
				data: info,
				email: member_email_variable,
				password: member_password_variable,
				household: member_household_id_variable,
				register_requirements: 'Registration parameters not met',
				fridge: '',
				balances: ''

			})
		}
	})
	.catch(err => {
		console.log('error', err);
		res.render('pages/register', {
			my_title: "Register",
			data: '',
			email: '',
			password: '',
			household: 0,
			register_requirements: '',
			fridge: '',
			balances: ''
		})
	});
});

app.post('/login', function(req, res) {
	var query = 'select * from Members;';
	var email_variable = req.body.email_entry;
	var password_variable = req.body.password_entry;
	var eq = false;
	var household_id = 0;
	var member_query = "select * from Members where username='" + email_variable + "' AND password='" + password_variable + "';";

	db.task('get-everything', task => {
		return task.batch([
			task.any(query),
			task.any(member_query)
		]);
	})
	.then(info => {
		info[0].forEach(function(item) {
			if(item.username == email_variable && item.password == password_variable) {
				eq = true;
			}
		});
		if(eq == true) {
			console.log('found it!');
			req.session.member_id = info[1][0].member_id;
			req.session.household_id = info[1][0].household_id;
			console.log("Temp maxage id:" + req.session.cookie.maxAge);
			console.log("Member_id:" + req.session.member_id);
			console.log("Household Id: " + req.session.household_id);

			var fridge = "SELECT * from Fridge WHERE household_id=" + req.session.household_id + ";";
        	var feedQuery = `SELECT * FROM Feed WHERE household_id=` + req.session.household_id + `;`;
        	var memberQuery = `SELECT * FROM Members WHERE household_id=`+ req.session.household_id +`;`;
        	var memberName = `SELECT username FROM Members WHERE memberId=`+ req.session.member_id +`;`;
			db.task('get-everything', task => {
				return task.batch([
					task.any(fridge),
        			task.any(feedQuery),
        		    task.any(memberQuery)
				]);
			})
			.then(info => {
          	var payData = calculateBalance(info[2], info[1], req.session.member_id);
				res.render('pages/dashboard',{
					my_title: "Dashboard",
					fridge: info[0],
					balances: payData,
					member: req.session.member_id,
					matching: "Login successful"
				})
			})
		}
		else {
			console.log('nope. try again');
			res.render('pages/login', {
				my_title: "Login",
				fridge: '',
				balances: '',
				member: '',
				matching: 'Incorrect username or password'
			})
		}
	})
	.catch(err => {
		console.log('error', err);
		res.render('pages/login', {
			my_title: '',
			data: '',
			memberQuery: '',
			matching: ''
		})
	})

});


app.listen(3000);
console.log('3000 is the magic port');
