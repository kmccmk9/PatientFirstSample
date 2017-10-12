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
        
        this.patients.push({ Test: 'Test' });

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
        this._patientService.getPatients().subscribe(resp => {
            this.patients = resp.json();
            console.log(resp.json()); //.json for json response, .text for text response
            //console.log(resp.headers);
        }, err => {
            if (err.error instanceof Error) {
                //Client side or network error
                console.log('An error occured:', err.error.message);
            } else {
                //Backend returned unsuccessful response code
                console.log('Backend return code ${err.status}, body was: ${err.error}');
            }
        });
    }

    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }

}
