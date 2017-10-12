import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { PatientService } from '../../patient.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    public patients: Array<any> = [];

    constructor(private _patientService: PatientService) {
        this._patientService.getPatients()
            .subscribe(res => {
                this.patients = [];
                res.forEach(element => {
                    var newPatient = {
                        givename: element.givename
                    };
                    this.patients.push(newPatient);
                });
            });//this.patients = res);

        this.sliders.push(//{
        //     imagePath: 'assets/images/slider1.jpg',
        //     label: 'First slide label',
        //     text: 'Nulla vitae elit libero, a pharetra augue mollis interdum.'
        // }, 
        {
            imagePath: 'assets/images/slider2.jpg',
            label: 'All Patients',
            text: 'Please see patient list below. To View patient, click their name'
        }, {
            imagePath: 'assets/images/slider3.jpg',
            label: 'Have A Great Day!',
            text: 'Your friends at PatientFirst.'
        });

        // this.alerts.push({
        //     id: 1,
        //     type: 'success',
        //     message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        //         Voluptates est animi quibusdam praesentium quam, et perspiciatis,
        //         consectetur velit culpa molestias dignissimos
        //         voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
        // }, {
        //     id: 2,
        //     type: 'warning',
        //     message: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        //         Voluptates est animi quibusdam praesentium quam, et perspiciatis,
        //         consectetur velit culpa molestias dignissimos
        //         voluptatum veritatis quod aliquam! Rerum placeat necessitatibus, vitae dolorum`
        // });
    }

    ngOnInit() {
    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }
}
