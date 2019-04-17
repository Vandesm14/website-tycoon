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
	components: {},
	status: 2,
	power: 0
};

var componentTemplate = {
	hdd: {
		specs: ['1TB', '2TB', '4TB', '8TB'],
		// pcu: 8, // Level = pcu + (0.25 * pcu * level)
		pcu: function (a) {
			return 8 + 0.25 * 8 * a;
		},
		// maxPages: 10,
		pages: function (a) {
			return 10 + 0.50 * 10 * a;
		},
		maxLevels: 4,
		// cost: 0 // 10x^2 + 30
		cost: function (a) {
			return 20 * Math.pow(a, 2) + 50;
		}
	},
	cpu: {
		specs: ['Single Core', 'Dual Core', 'Quad Core', 'Eight Core'],
		// pcu: 16,
		pcu: function (a) {
			return 16 + 0.25 * 16 * a;
		},
		// maxVisitors: 100, // Level = maxVisitors + (0.25 * maxVisitors * level)
		visitors: function (a) {
			return 100 + 0.50 * 100 * a;
		},
		maxLevels: 4,
		// cost: 0 // // 10x^2 + 100
		cost: function (a) {
			return 40 * Math.pow(a, 2) + 110;
		}
	},
	motherboard: {
		// specs: ['Single Core', 'Dual Core', 'Quad Core', 'Eight Core'],
		// pcu: 16,
		pcu: function (a) {
			return 10 + 0.25 * 10 * a;
		},
		maxLevels: 4,
		// cost: 0 // // 10x^2 + 100
		cost: function (a) {
			return 30 * Math.pow(a, 2) + 60;
		}
	}
};

var facilities = [{
	servers: [{
		components: {
			hdd: 0,
			cpu: 0,
			motherboard: 0
		},
		status: 2,
		power: 0
	}],
}];

var stats = {
	wallet: 70 // post to website
};

var gameVars = { // Holding Variables for calculations
	expenses: {
		pcu: 0 // Total PCU
	},
	visitors: 0,
	pages: 0,
	ads: 0,
	siteStats: ['off', 'down', 'up'],
	income: 0
};

var expenses = { // Conversions for $$ per day
	property: 0,
	power: 0,
	network: 0
};

/* --------------------------- JQuery Liteners --------------------------- */
/* -------- Custom Tabs -------- */
$(document).ready(function () {
	document.getElementById('music').volume = 0.7;
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
		clickRowContent(this);
	});
});

/* --------------------------- Sequences --------------------------- */
function startSequence() {
	// Run DOM functions to update values & stats
}

function clickRowContent(e) {
	if (!$(e).hasClass('disabled')) {
		var fIndex = parseInt($('#facilitySelector').val()) - 1; // Facility Index
		var sIndex = parseInt($('#serverSelector').val()) - 1; // Server Index
		var rowname = $(e).closest('.item_row').data('rowname').toLowerCase();
		var selector = facilities[fIndex].servers[sIndex].components[rowname];
		var level = $(e).index();
		var hold;
	
		switch ($(e).closest('.tab_content').data('tabname')) {
			case 'Hardware':
				var item = componentTemplate[rowname];
				if (checkCost(componentTemplate[rowname].cost(level))) { // If cost <= wallet
					if (typeof facilities[fIndex] === 'undefined' || null) { // If facility not exist
						alert('No Facility Selected!');
					} else {
						if (typeof facilities[fIndex].servers[sIndex] === 'undefined' || null) { // If server not exist
							alert('No Servers Attached to Facility!');
						} else {
							if (facilities[fIndex].servers[sIndex][rowname] !== 'undefined' || null) { // If component not exist
								confirmAsync(`Replace ${rowname} in Server ${sIndex + 1} of Facility ${fIndex + 1}?`, function () {
									facilities[fIndex].servers[sIndex].components[rowname] = level;
									stats.wallet -= componentTemplate[rowname].cost(level);
								});
							} else {
								facilities[fIndex].servers[sIndex].components[rowname] = level;
								stats.wallet -= componentTemplate[rowname].cost(level);
							}
						}
					}
				} else {
					alert('Not enough cash to buy component!');
				}
				break;
			case 'Servers':
				var item = componentTemplate.motherboard;
				if (checkCost(componentTemplate.motherboard.cost(level))) { // If cost <= wallet
					if (typeof facilities[fIndex] === 'undefined' || null) { // If facility not exist
						alert('No Facility Selected!');
					} else {
						hold = cloneObj(serverTemplate);
						hold.components.motherboard = level;
						facilities[fIndex].servers.push(hold);
						stats.wallet -= componentTemplate.motherboard.cost(level);
					}
				} else {
					alert('Not enough cash to buy server!');
				}
				break;
			case 'Facilities':
	
				break;
			case 'Ads':
	
				break;
		}
	}
}

function mainSequence() {
	computePCU();
	computeNetwork();
	computeVisitors();
	stats.wallet -= expenses.power;
	stats.wallet -= expenses.network;
	stats.wallet += gameVars.income;
	// stats.wallet -= expenses.property*12;
	updateStats();
	updateServerList();
}

startSequence();
setInterval(mainSequence, 1000);

/* --------------------------- DOM Functions --------------------------- */
function updateServerList() {
	var hold;
	var elem;
	for (var i in facilities[0].servers) {
		hold = facilities[0].servers[i];
		elem = $(`.site_box:eq(${i})`);
		elem.attr('class', 'site_box ' + gameVars.siteStats[hold.status]);
		if (typeof hold.components.hdd === 'undefined' || null) {
			elem.find('.site_box_stats .site_box_component:eq(0)').text('HDD: None');
		} else {
			elem.find('.site_box_stats .site_box_component:eq(0)').text('HDD: ' + componentTemplate.hdd.specs[hold.components.hdd]);
		}
		if (typeof hold.components.cpu === 'undefined' || null) {
			elem.find('.site_box_stats .site_box_component:eq(1)').text('CPU: None');
		} else {
			elem.find('.site_box_stats .site_box_component:eq(1)').text('CPU: ' + componentTemplate.cpu.specs[hold.components.cpu]);
		}

		elem.find('.site_box_stats .site_box_power').text(facilities[0].servers[i].power);
		// elem.find('.site_box_stats .site_box_power').text(facilities[0].servers[i].power);
	}
}

function updateStats() {
	$('#wallet').text(stats.wallet.toFixed(2));
	$('#income').text(gameVars.income.toFixed(2));
	$('#visitors').text(gameVars.visitors);
	$('#electricityBill').text(expenses.power.toFixed(2));
	$('#networkBill').text(expenses.network.toFixed(2));
	// $('#propertyBill').text();
}

/* --------------------------- Computing Functions --------------------------- */
function computePCU() {
	// Run though all facilities + servers and gather total power expense
	gameVars.expenses.pcu = 0;
	var hold;
	var iPower;
	for (var i in facilities) { // Facilities
		for (var j in facilities[i].servers) { // Servers
			iPower = 0;
			for (var k in facilities[i].servers[j].components) { // Components
				hold = facilities[i].servers[j].components;
				iPower += componentTemplate[k].pcu(hold[k]);
			}
			facilities[i].servers[j].power = iPower;
			gameVars.expenses.pcu += iPower;
		}
	}
	expenses.power = gameVars.expenses.pcu * 0.0114;
}

function computeNetwork() {
	expenses.network = gameVars.visitors * 0.0022;
}

function computeVisitors() { // Run though all facilities + servers and gather total power expense
	gameVars.visitors = 0;
	gameVars.pages = 0;
	var hold;
	var pages = 0;
	var visitors = 0;
	for (var i in facilities) { // Facilities
		for (var j in facilities[i].servers) { // Servers
			for (var k in facilities[i].servers[j].components) { // Components
				hold = facilities[i].servers[j].components;
				if (k === 'hdd' || k === 'ssd') {
					pages += componentTemplate.hdd.pages(hold[k]);
				} else if (k === 'cpu') {
					visitors += componentTemplate.cpu.visitors(hold[k]);
				}
			}
			gameVars.visitors += visitors;
			gameVars.pages += pages;
			gameVars.income = visitors * pages * 0.0008;
		}
	}
}

/* -------- Sub-Computing Functions (Checks) -------- */
function checkCost(a) {
	// return stats.wallet - a >= 0;
	return a < stats.wallet;
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

function newComponent(f, s, comp, l) {
	facilities[f].servers[s].components[comp] = l;
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