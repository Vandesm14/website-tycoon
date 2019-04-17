/* --------------------------- Variables --------------------------- */
var maxServers = 10;

/* --------------------------- Objects --------------------------- */
var facilityTemplate = {
	servers: [],
	expenses: {
		power: 0,
		network: 0,
		property: 0
	}
};

var serverTemplate = {
	status: 1,
	hdd: 0,
	cpu: 0
};

var componentTemplate = {
	hdd: {
		specs: ['1TB', '2TB', '4TB', '8TB'],
		pcu: 8, // Level = pcu + (0.25 * pcu * level)
		maxPages: 10,
		maxLevels: 4,
	},
	cpu: {
		specs: ['Single Core', 'Dual Core', 'Quad Core', 'Eight Core'],
		pcu: 16,
		maxVisitors: 100, // Level = maxVisitors + (0.25 * maxVisitors * level)
		maxLevels: 4
	}
};

var facilities = [];

var stats = {
	wallet: 500
};

var gameVars = { // Holding Variables for calculations
	expenses: {
		pcu: 0 // Total PCU
	},
	visitors: 0,
	pages: 0,
	ads: 0
};

// var facilities = [{
// 	servers: [{
// 		components: {
// 			hdd: 1,
// 			cpu: 1
// 		},
// 		pages: 1
// 	}],
// 	expenses: {
// 		power: 0,
// 		network: 0,
// 		property: 0
// 	}
// }];

var expenses = { // Conversions for $$ per day
	property: 333 * facilities.length,
	electricity: gameVars.expenses.pcu * 0.114,
	network: 0
};

/* --------------------------- JQuery Liteners --------------------------- */
/* -------- Custom Tabs -------- */
$(document).ready(function () {
	var x = $('.tab_title[data-tabfirst]');
	$('.tab', x).toggleClass('active', true);
	$('.tab_box .tab_content[data-tabid="' + $(x).data('tabidp') + '"]').show();

	$('.tab').on('click', function () {
		$('.tab_box .tab_content').hide();
		$('.tab').toggleClass('active', false);
		$(this).toggleClass('active', true);
		$('.tab_box .tab_content[data-tabid="' + $('.tab_title', this).data('tabidp') + '"]').show();
	});

	/* -------- Custom Store -------- */
	$('.item_row_content').on('click', function () {
		if (!$(this).hasClass('disabled')) {
			var fIndex = $('#facilitySelector').val(); // Facility Index
			var sIndex = $('#serverSelector').val(); // Server Index
			var rowname = $(this).closest('.item_row').data('rowname').toLowerCase();
			var selector = facilities[fIndex].servers[sIndex][rowname];
			// console.log('Tab: ' + $(this).closest('.tab_content').data('tabname'));
			// console.log('Row: ' + $(this).closest('.item_row').data('rowname'));
			// console.log('Level: ' + ($(this).index() + 1));

			switch ($(this).closest('.tab_content').data('tabname')) {
				case 'Hardware':
					var item = componentTemplate[rowname];
					if (selector === undefined) {
						// selector = $(this).index();
						// Add new component
					} else {
						confirmAsync(`Replace ${rowname} in Server ${sIndex} of Facility ${fIndex}?`, function () {
							// selector = $(this).index();
							// Replace existing component
						});
					}
					break;
				case 'Servers':

					break;
				case 'Facilities':

					break;
				case 'Ads':

					break;
			}
		}
	});
});

/* --------------------------- Sequences --------------------------- */
function startSequence() {
	// alert('You currently have no servers. To get one, pick a motherboard below');
}

function mainSequence() {

}

startSequence();
// setInterval(mainSequence, 1000);

/* --------------------------- DOM Functions --------------------------- */
function updateServerList() {

}

function updateStorePage() {

}

function updateStats() {

}

/* --------------------------- Computing Functions --------------------------- */
function computePower() {
	// Run though all facilities + servers and gather total power expense
	var power = facilities[i].power + servers[i].power;
	// post the power to website
	document.getElementById('electricityBill').textContent /* or .innerHTML? */ = power + '%';
}

function computeNetwork() {

}

function computeVisitors() {

}

/* -------- Sub-Computing Functions (Checks) -------- */
function checkCost(a, b) {
	return a >= stats.wallet;
}

function checkExistFacility() {

}

/* --------------------------- Game Functions --------------------------- */
function newFacility() {
	facilities.push(cloneObj(facilityTemplate));
}

function newServer(f) {
	facilities[f].servers.push(cloneObj(serverTemplate));
}

function newComponent(f, s, comp) {
	facilities[f].servers[s].components.push(cloneObj(componentTemplate[comp]));

}

function newPage() {

}

function newAd() {

}

/* --------------------------- Helper Functions --------------------------- */
function cloneObj(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function confirmAsync(a, b, c) {
	var e = confirm(a);
	if (e) {
		b(e);
	} else {
		if (c !== undefined) {
			c(e);
		}
	}
}