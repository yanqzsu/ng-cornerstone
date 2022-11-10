import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { api } from 'dicomweb-client';
import { data } from 'dcmjs';
import { Router } from '@angular/router';
import { DICOM_SERVER, StudyInfo } from '../core';

const { DicomMetaDictionary } = data;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  studyList: StudyInfo[] = [];

  constructor(private httpClient: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // this.httpClient
    //   .get(DICOM_SERVER + '/studies', {
    //     responseType: 'json',
    //   })
    //   .subscribe((value) => {
    //     if (value) {
    //       console.log(value);
    //     }
    //   });
    const client = new api.DICOMwebClient({ url: DICOM_SERVER });
    client.searchForStudies().then((studies) => {
      const studyObject = studies.map((study) => {
        const metadata = DicomMetaDictionary.naturalizeDataset(study);
        console.log('study');
        console.log(metadata);
        return {
          patientName: metadata.PatientName.Alphabetic,
          studyDate: metadata.StudyDate,
          patientId: metadata.PatientID,
          modality: metadata.ModalitiesInStudy,
          studyInstanceUID: metadata.StudyInstanceUID,
        };
      });
      this.studyList = [...studyObject];
      console.log(studyObject);
    });
  }

  gotoStudy(study: StudyInfo) {
    this.router.navigate(['study', study.studyInstanceUID]);
  }
}
