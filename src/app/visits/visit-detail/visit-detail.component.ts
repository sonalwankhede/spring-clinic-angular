import { Component, OnInit } from '@angular/core';
import { Patient } from 'app/patients/patient';
import { ActivatedRoute, Router } from 'app/testing/router-stubs';
import { MatDialog, MatDialogRef, MatTableDataSource } from '@angular/material';
import { Visit } from '../visit';
import { VisitService } from '../visit.service';
import { PrescriptionUtil } from './prescription-util';
import { PrescriptedDrugs } from '../visit-add/visit-add.component';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AlertDialogComponent } from 'app/common-component/dialog/alert-dialog/alert-dialog.component';
import { ConfirmDialogModel } from 'app/common-component/dialog/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-visit-detail',
  templateUrl: './visit-detail.component.html',
  styleUrls: ['./visit-detail.component.css']
})
export class VisitDetailComponent implements OnInit {
  @ViewChild('content', { static: true }) content: ElementRef;

  visit: Visit;
  currentPatient: Patient;
  prescription: PrescriptedDrugs[];
  updateSuccess = false;
  errorMessage: string;
  dataSourceVisit = new MatTableDataSource<Visit>();
  dialogRef: MatDialogRef<AlertDialogComponent>;

  displayedColumns: string[] = ['name', 'age', 'gender', 'knownCaseOf', 'drugAllergies',
    'otherAllergies', 'vitals', 'complaints', 'observations', 'diagnosis', 'drug', 'dose', 'duration', 'instructions'];
  showTable: boolean = false;
  visitdate: string;
  loader: boolean;

  constructor(private visitService: VisitService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog,
    public datepipe: DatePipe) {
    this.visit = {} as Visit;
    this.currentPatient = {} as Patient;
  }
  ngOnInit() {
    const visitId = this.route.snapshot.params.id;
    this.visitService.getVisitById(visitId).subscribe(
      response => {
        this.visit = response;
        this.prescription = this.visit['prescription'];
        this.prescription.sort(function (a, b) {
          return a.serialNumber - b.serialNumber;
        });
        this.currentPatient = this.visit.patient;
        this.dataSourceVisit.data = this.visit as unknown as Visit[];
        this.showTable = true;
        this.visitdate = this.datepipe.transform(this.visit.visitDate, 'dd   MM   yyyy');
      }, (error) => {
        console.log(error);
        this.errorMessage = 'There was an issue fetching visit details. Please retry';
        const dialogData = new ConfirmDialogModel("Error", this.errorMessage);
        this.dialogRef = this.dialog.open(AlertDialogComponent, {
          data: dialogData
        });
        this.dialogRef.afterClosed().subscribe(dialogResult => {
          const result = dialogResult;
          if (result) {
            this.loader = false;
            this.router.navigate(['/patients/' + this.currentPatient.id, 'visits/add',]);
          }
        });
      });
  }

  exportTable() {
    PrescriptionUtil.exportToPdf("pdfTable");
  }
  getBmiValue() {
    if (this.visit.bmi < 18.5) {
      return 'Under Weight';
    } else if (this.visit.bmi >= 18.5 && this.visit.bmi <= 24) {
      return 'Healthy Weight';
    } else if (this.visit.bmi > 24 && this.visit.bmi <= 29.9) {
      return 'Over Weight';
    } else if (this.visit.bmi > 30) {
      if (this.visit.bmi > 30 && this.visit.bmi <= 34.99) {
        return 'Obese Class I';
      } else if (this.visit.bmi >= 35 && this.visit.bmi <= 39.99) {
        return 'Obese Class II';
      } else if (this.visit.bmi >= 40) {
        return 'Obese Class III';
      }
    }
  }
  goToEdit() {
    this.loader = true;
    this.router.navigate(['/patients', this.visit.patient.id, 'visits', this.visit.id, 'edit']);
  }
  goToPatient() {
    this.loader = true;
    this.router.navigate(['/patients', this.visit.patient.id, 'edit']);
  }
  public SavePDF(): void {

    this.showTable = false;
    this.loader = true;
    let DATA = document.getElementById('htmlData');

    html2canvas(DATA).then(canvas => {

      var ctx = canvas.getContext('2d');
      //set the image quality
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      let fileWidth = 180;
      let fileHeight = canvas.height * fileWidth / canvas.width;

      const FILEURI = canvas.toDataURL('image/png')
      let PDF = new jsPDF('p', 'in', [510, 737]);
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight, 'alias', 'FAST')
      PDF.save((this.currentPatient.firstName + '_' + this.currentPatient.middleName + '_' + this.currentPatient.lastName + '_' + this.visitdate + '.pdf').replace(/   /g, '_'));
      this.showTable = true;
      this.loader = false;
    });
  }
}
