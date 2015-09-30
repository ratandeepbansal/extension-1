(function () {
	'use strict';

	angular
		.module('app')
		.controller('Controller', Controller);

	Controller.$inject = ['$scope', '$filter', 'i18nService',
						  'constants', 'uiGridConstants', 'uiGridGroupingConstants'];

	function Controller($scope, $filter, i18nService, c, gridConst, gridGroupConst) {
		var vm = this;

		var userLocale = chrome.i18n.getUILanguage();
		i18nService.setCurrentLang(userLocale);

		vm.model = {
			origins: [],
			destinations: [],
			departures: [],
			returns: [],
			qtyDays: [],
			site: null,
			email: null,
			priceEmail: null,
			adults: 1,
			children: 0,
			infants: 0
		};

		vm.gridOptions = {
			data: [],
			enableFiltering: false,
			enableGroupHeaderSelection: true,
			enableGridMenu: true,
			treeRowHeaderAlwaysVisible: false,
			enableHorizontalScrollbar: gridConst.scrollbars.NEVER,
			horizontalScrollThreshold: 6,
			maxVisibleColumnCount: 10,
			minRowsToShow: 30,
			virtualizationThreshold: 30,

			// see more on: http://ui-grid.info/docs/#/tutorial/216_expandable_grid
			expandableRowTemplate: 'expandableRowTemplate.html',
			expandableRowHeight: 130,

			// see more on: http://ui-grid.info/docs/#/api/ui.grid.class:GridOptions.columnDef
			columnDefs: [
				{
					name: 'key',
					field: 'key',
					type: 'string',
					displayName: c.grid.originDestination,
					displayName: c.grid.originDestinationTooltip,
					width: '*', //'17%',
					minWidth: 80,
					/*
					grouping: {
						groupPriority: 0
					},
					*/
					cellTooltip: true,
					cellTemplate: 'groupingTemplate.html',
					customTreeAggregationFinalizerFn: function (aggregation) {
						aggregation.rendered = aggregation.groupVal;
					},
					groupingShowAggregationMenu: false,
					enableHiding: false
				},
				{
					name: 'departure',
					field: 'departure',
					type: 'number',
					displayName: c.grid.departure,
					headerTooltip: c.grid.departureTooltip,
					width: '*',
					cellTooltip: true,
					cellTemplate: 'groupingTemplate.html',
					cellFilter: 'toDate',
					customTreeAggregationFinalizerFn: function (aggregation) {
						aggregation.rendered = aggregation.groupVal;
					},
					groupingShowAggregationMenu: false,
					enableHiding: false
				},
				{
					name: 'return',
					field: 'return',
					type: 'number',
					displayName: c.grid.return,
					headerTooltip: c.grid.returnTooltip,
					width: '*',
					cellTooltip: true,
					cellTemplate: 'groupingTemplate.html',
					cellFilter: 'toDate',
					customTreeAggregationFinalizerFn: function (aggregation) {
						aggregation.rendered = aggregation.groupVal;
					},
					groupingShowAggregationMenu: false,
					enableHiding: true
				},
				{
					name: 'prices0',
					field: 'prices[0]',
					type: 'number',
					displayName: c.grid.nonStop,
					headerTooltip: c.grid.nonStopTooltip,
					width: '*',
					cellTooltip: true,
					cellFilter: 'toPrice:this',
					cellTemplate: 'priceTemplate.html',
					treeAggregationType: gridGroupConst.aggregation.MIN,
					customTreeAggregationFinalizerFn: function (aggregation) {
						aggregation.rendered = aggregation.value;
					},
					enableColumnMenu: false,
					enableHiding: true
				},
				{
					name: 'prices1',
					field: 'prices[1]',
					type: 'number',
					displayName: c.grid.oneStop,
					headerTooltip: c.grid.oneStopTooltip,
					width: '*',
					cellTooltip: true,
					cellFilter: 'toPrice:this',
					cellTemplate: 'priceTemplate.html',
					treeAggregationType: gridGroupConst.aggregation.MIN,
					customTreeAggregationFinalizerFn: function (aggregation) {
						aggregation.rendered = aggregation.value;
					},
					enableColumnMenu: false,
					enableHiding: true
				},
				{
					name: 'prices2',
					field: 'prices[2]',
					type: 'number',
					displayName: c.grid.twoStops,
					headerTooltip: c.grid.twoStopsTooltip,
					width: '*',
					cellTooltip: true,
					cellFilter: 'toPrice:this',
					cellTemplate: 'priceTemplate.html',
					treeAggregationType: gridGroupConst.aggregation.MIN,
					customTreeAggregationFinalizerFn: function (aggregation) {
						aggregation.rendered = aggregation.value;
					},
					enableColumnMenu: false,
					enableHiding: true
				}
			],

			//see more on: http://ui-grid.info/docs/#/api/ui.grid.exporter.api:GridOptions
			exporterCsvFilename: 'genghis.csv',
			//exporterCsvColumnSeparator: ';',
			exporterFieldCallback: function (grid, row, col, value) {
				switch (col.name) {
				case 'departure':
				case 'return':
					return $filter('toDate')(value);

				case 'prices0':
				case 'prices1':
				case 'prices2':
					return $filter('toPrice')(value);

				default:
					return value;
				}
			},
			exporterMenuPdf: false,
			exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
			onRegisterApi: function (gridApi) {
				vm.gridApi = gridApi;
			}
		};

		vm.subGridOptions = {
			data: [],
			columnDefs: [
				{
					name: 'company',
					field: 'company',
					type: 'string',
					displayName: c.grid.company,
					headerTooltip: c.grid.companyTooltip,
					width: '*',
					cellTooltip: true,
					enableHiding: false
				},
				{
					name: 'prices0',
					field: 'prices[0]',
					type: 'number',
					displayName: c.grid.nonStop,
					headerTooltip: c.grid.nonStopTooltip,
					width: '*',
					cellTooltip: true,
					cellFilter: 'toPrice:this',
					cellTemplate: 'priceTemplate.html',
					enableColumnMenu: false
				},
				{
					name: 'prices1',
					field: 'prices[1]',
					type: 'number',
					displayName: c.grid.oneStop,
					headerTooltip: c.grid.oneStopTooltip,
					width: '*',
					cellTooltip: true,
					cellFilter: 'toPrice:this',
					cellTemplate: 'priceTemplate.html',
					enableColumnMenu: false
				},
				{
					name: 'prices2',
					field: 'prices[2]',
					type: 'number',
					displayName: c.grid.twoStops,
					headerTooltip: c.grid.twoStopsTooltip,
					width: '*',
					cellTooltip: true,
					cellFilter: 'toPrice:this',
					cellTemplate: 'priceTemplate.html',
					enableColumnMenu: false
			}]
		};

		vm.showForm = true;
		vm.showQtyDays = false;
		vm.messageError = '';
		vm.initialNumberOfFlights = 0;
		vm.days = [];
		vm.sites = [];

		vm.start = start;
		vm.stop = stop;
		vm.deleteHistory = deleteHistory;
		vm.updateForm = updateForm;
		vm.broadcast = broadcast;
		vm.updateResults = updateResults;

		activate();

		/////////////

		function activate() {
			var backgroundPage = getBackgroundPage();
			var bg = backgroundPage.BG;
			bg.hideBadge();

			vm.airports = backgroundPage.airports;
			vm.airportsById = backgroundPage.airportsById;
			vm.airlines = backgroundPage.airlines;

			vm.days = [{
				id: -1,
				text: c.days.oneWay
            }, {
				id: 0,
				text: c.days.returnSameDay
            }, {
				id: 1,
				text: '1 ' + c.days.singular
            }];

			for (var i = 2; i <= 120; i++) {
				vm.days.push({
					id: i,
					text: i + ' ' + c.days.plural
				});
			}

			setupDatepickers();

			vm.savedSearches = bg.getRequests();
			if (vm.savedSearches && vm.savedSearches.length > 0) {
				var recentSearch = vm.savedSearches[0];
				
				// saved data from old version, different format, so clear all storage
				if (!recentSearch.site) // we had field store instead of site
					deleteHistory();
				else
					updateForm(recentSearch);
			}
			
			vm.showLoading = bg.showLoading();
			vm.sites = bg.getSites();
			vm.initialNumberOfFlights = bg.getInitialNumberOfFlights() || 0;
			updateResults(bg.getResults());
		}

		function start() {
			var model = angular.copy(vm.model);
			if (!setMessageError(model)) return;

			vm.showForm = false;
			vm.gridOptions.data = [];

			vm.initialNumberOfFlights = getBg().initServer(model);
		}

		function stop() {
			getBg().stopServer();
		}

		function deleteHistory() {
			getBg().deleteHistory();

			stop();
			updateForm();

			vm.savedSearches = [];
			vm.gridOptions.data = [];
			vm.initialNumberOfFlights = 0;
		}

		function updateForm(request) {
			request = request || {};
			if (typeof request === 'string')
				request = JSON.parse(request);

			var today = new Date().setHours(0, 0, 0, 0);
			vm.model = {
				origins: request.origins || [],
				destinations: request.destinations || [],
				departures: (request.departures || []).filter(function (d) {
					return d >= today
				}),
				returns: (request.returns || []).filter(function (d) {
					return d >= today
				}),
				qtyDays: request.qtyDays || [],
				site: request.site || vm.sites[0].id,
				email: request.email || null,
				priceEmail: request.priceEmail || null,
				adults: request.adults || 1,
				children: request.children || 0,
				infants: request.infants || 0
			};

			vm.showQtyDays = vm.model.qtyDays.length > 0;
		}

		function broadcast(event) {
			$scope.$broadcast(event);
		}

		function updateResults(results) {
			if (!results || results.length === 0) return;

			for (var i = 0; i < results.length; i++) {
				var result = results[i];

				for (var j = 0; j < result.byCompany.length; j++)
					result.byCompany[j].url = result.url;

				result.subGridOptions = {
					data: result.byCompany,
					columnDefs: vm.subGridOptions.columnDefs
				};
			}

			vm.gridOptions.data = results;
		}

		function setMessageError(model) {
			vm.messageError = '';

			if (model.origins.length === 0)
				vm.messageError = c.messages.selectAtLeastOneOrigin;

			else if (model.destinations.length === 0)
				vm.messageError = c.messages.selectAtLeastOneDestination;

			else if (model.origins.length === 1 && model.destinations.length === 1 && model.origins[0] === model.destinations[0])
				vm.messageError = c.messages.sameOriginAndDestination;

			else if (model.departures.length === 0)
				vm.messageError = c.messages.selectAtLeastOneDeparture;

			else if (model.adults == 0 && model.children == 0 && model.infants == 0)
				vm.messageError = c.messages.selectAtLeastOnePassenger;

			return vm.messageError === '';
		}

		function setupDatepickers() {
			$scope.$watchCollection('vm.model.departures', function (newVal, oldVal) {
				if (newVal && newVal.length > 0)
					vm.minDeparture = Math.min.apply(null, newVal);
				else
					vm.minDeparture = new Date().setHours(0, 0, 0, 0);

				vm.initDateDeparture = new Date(vm.minDeparture);

				if (vm.model.returns && vm.model.returns.length > 0) {
					vm.initDateReturn = new Date(Math.min.apply(null, vm.model.returns));
				} else {
					vm.initDateReturn = new Date(vm.minDeparture);
				}
			});
		}

		function getBg() {
			return getBackgroundPage().BG
		}

		function getBackgroundPage() {
			return chrome.extension.getBackgroundPage();
		}
	}
})();
