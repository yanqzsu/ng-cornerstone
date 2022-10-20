import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { api } from 'dicomweb-client';
import { data } from 'dcmjs';

const QIDO_SERVER: string = 'http://10.81.20.156:8080/dicom-web';
const { DicomMetaDictionary } = data;

export interface Study {
  patientName?: string;
  studyDate?: Date;
  patientId?: string;
  modality?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  studyList: Study[] = [];

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    this.httpClient
      .get(QIDO_SERVER + '/studies', {
        responseType: 'json',
      })
      .subscribe((value) => {
        if (value) {
          console.log(value);
        }
      });
    const client = new api.DICOMwebClient({ url: QIDO_SERVER });
    client.searchForStudies().then((studies) => {
      const studyObject = studies.map((studyMeta) => {
        const instance = DicomMetaDictionary.naturalizeDataset(studyMeta);
        console.log(instance);
        return {
          patientName: instance.PatientName.Alphabetic,
          studyDate: instance.StudyDate,
          patientId: instance.PatientID,
          modality: instance.ModalitiesInStudy,
        };
      });
      this.studyList = [...studyObject];
      console.log(studyObject);
    });
  }
}
