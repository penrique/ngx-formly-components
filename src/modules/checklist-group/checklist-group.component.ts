import { Component, OnInit, DoCheck, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Field } from 'ng-formly';
import { Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { MdCheckboxChange } from "@angular/material";

@Component({
    selector: 'ngx-formly-component-checklist-group',
    styles: [`
    :host /deep/ .mat-checkbox-label {
        font-weight: normal !important;
    },
    .chk-item {
        width: 100%;
    }
    `],
    template: `
    <div *ngFor="let item of items" class="chk-item">
        <md-checkbox [ngModel]="checked[item.value]" (change)="toggle($event, item)">{{item.name}}</md-checkbox>
    </div>
    `,
    encapsulation: ViewEncapsulation.Emulated
})
export class FormlyChecklistGroupComponent extends Field implements OnInit, OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    public items: any[];
    public selectedItems: any[];
    public checked: { [number: number]: boolean } = {};
    private blocked: boolean = false;

    constructor() {
        super();
    }

    ngOnInit() {
        this.selectedItems = this.formControl.value;
        this.to.source && this.to.source.takeUntil(this.ngUnsubscribe).subscribe(x => {
            this.items = x.slice();
            if (this.formControl.value) {
                this.checked = {};
                for (var i = 0; i < this.selectedItems.length; i++) {
                    var a = this.selectedItems[i];
                    for (var j = 0; j < this.items.length; j++) {
                        var b = this.items[j];
                        if (a.value == b.value) {
                            this.checked[a.value] = true;
                            break;
                        }
                    }
                }
            }
        });

        this.formControl.valueChanges.takeUntil(this.ngUnsubscribe).subscribe(x => {
            this.selectedItems = x;
            this.checked = {};

            for (var i = 0; i < this.selectedItems.length; i++) {
                var a = this.selectedItems[i];
                for (var j = 0; j < this.items.length; j++) {
                    var b = this.items[j];
                    if (a.value == b.value) {
                        this.checked[a.value] = true;
                        break;
                    }
                }
            }
        });
    }

    toggle(e: MdCheckboxChange, item: any) {
        if (e.checked) {
            this.checked[item.value] = true;
            this.selectedItems.push(item);
            this.formControl.setValue(this.selectedItems);
        }
        else {
            for (var i = 0; i < this.selectedItems.length; i++) {
                var a = this.selectedItems[i];
                if (a.value == item.value) {
                    delete this.checked[item.value];
                    this.selectedItems.splice(i, 1);
                    this.formControl.setValue(this.selectedItems);
                    return;
                }
            }
        }
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }

}