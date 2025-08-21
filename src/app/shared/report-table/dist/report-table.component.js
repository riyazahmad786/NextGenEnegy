"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ReportTableComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var report_processor_1 = require("../../pages/report/helper/report-processor");
var object_keys_pipe_1 = require("../pipes/object-keys.pipe");
var rounding_pipe_1 = require("../pipes/rounding.pipe");
var ReportTableComponent = /** @class */ (function () {
    function ReportTableComponent(roundingService) {
        this.roundingService = roundingService;
        this.assets = [];
        this.reportType = 'Hourly';
        this.rows = [];
        this.columns = [];
        this.tableData = {};
    }
    ReportTableComponent.prototype.ngOnChanges = function (changes) {
        if (changes['assets']) {
            if (changes['assets'].currentValue !== changes['assets'].previousValue) {
                this.assets = changes['assets'].currentValue;
                if (this.assets.length > 0) {
                    //this.tableData= this.assets;
                    this.processData();
                }
            }
        }
    };
    ReportTableComponent.prototype.hasData = function (data) {
        return Object.keys(data).length > 0;
    };
    ReportTableComponent.prototype.processData = function () {
        this.rows = [];
        this.columns = [];
        this.tableData = {};
        var reportProcessor = new report_processor_1.ReportProcessor(this.assets, this.reportType, this.roundingService);
        reportProcessor.processData();
        this.rows = reportProcessor.rows;
        this.columns = reportProcessor.columns;
        this.tableData = reportProcessor.tableData;
    };
    __decorate([
        core_1.Input()
    ], ReportTableComponent.prototype, "assets");
    __decorate([
        core_1.Input()
    ], ReportTableComponent.prototype, "reportType");
    ReportTableComponent = __decorate([
        core_1.Component({
            selector: 'app-report-table',
            standalone: true,
            templateUrl: './report-table.component.html',
            styleUrl: './report-table.component.css',
            imports: [common_1.CommonModule, object_keys_pipe_1.ObjectKeysPipe, rounding_pipe_1.RoundingPipe]
        })
    ], ReportTableComponent);
    return ReportTableComponent;
}());
exports.ReportTableComponent = ReportTableComponent;
