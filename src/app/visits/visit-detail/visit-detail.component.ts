import { Component, OnInit } from '@angular/core';
import { Patient } from 'app/patients/patient';
import { ActivatedRoute, Router } from 'app/testing/router-stubs';
import { MatTableDataSource } from '@angular/material';
import { Visit } from '../visit';
import { VisitService } from '../visit.service';
import { PrescriptionUtil } from './prescription-util';
import { PrescriptedDrugs } from '../visit-add/visit-add.component';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { DatePipe } from '@angular/common';

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

  displayedColumns: string[] = ['name', 'age', 'gender', 'knownCaseOf', 'drugAllergies',
    'otherAllergies', 'vitals', 'complaints', 'observations', 'diagnosis', 'drug', 'dose', 'duration', 'instructions'];
  showTable: boolean = false;
  visitdate: string;
  loader: boolean;

  constructor(private visitService: VisitService, private route: ActivatedRoute, private router: Router, public datepipe: DatePipe) {
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
      },
      error => this.errorMessage = error as any);
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
    this.router.navigate(['/patients', this.visit.patient.id, 'visits', this.visit.id, 'edit']);
  }
  goToPatient() {
    this.router.navigate(['/patients', this.visit.patient.id, 'edit']);
  }
  public SavePDF(): void {

    this.showTable = false;
    this.loader = true;
    let DATA = document.getElementById('htmlData');

    html2canvas(DATA).then(canvas => {

      let fileWidth = 180;
      let fileHeight = canvas.height * fileWidth / canvas.width;

      const FILEURI = canvas.toDataURL('image/png')
      let PDF = new jsPDF('p', 'in', [510, 737]);
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight, 'alias', 'SLOW')
      PDF.save((this.currentPatient.firstName + '_' + this.currentPatient.middleName + '_' + this.currentPatient.lastName + '_' + this.visitdate + '.pdf').replace(/   /g, '_'));
      this.showTable = true;
      this.loader = false;
    });
  }
}
