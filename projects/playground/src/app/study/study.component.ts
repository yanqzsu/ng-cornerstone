import { Component, OnInit } from '@angular/core';
import ViewportType from '@cornerstonejs/core/dist/esm/enums/ViewportType';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { DICOM_SERVER, ImageInfo, SeriesInfo } from '../core';
import { data } from 'dcmjs';
const { DicomMetaDictionary } = data;
import { api } from 'dicomweb-client';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss'],
})
export class StudyComponent implements OnInit {
  imageInfo?: ImageInfo;
  seriesInfos: SeriesInfo[] = [];
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(map((params) => params.get('id')))
      .subscribe((uid) => {
        const client = new api.DICOMwebClient({ url: DICOM_SERVER });
        client
          .searchForSeries({
            studyInstanceUID: uid,
          })
          .then((series) => {
            this.seriesInfos = series.map((seriesMeta) => {
              const metadata =
                DicomMetaDictionary.naturalizeDataset(seriesMeta);
              console.log('series');
              console.log(metadata);
              return {
                studyInstanceUID: uid,
                seriesInstanceUID: metadata.SeriesInstanceUID,
                wadoRsRoot: DICOM_SERVER,
                volumeId: metadata.SeriesInstanceUID,
                accessionNumber: metadata.AccessionNumber,
                seriesDesc: metadata.SeriesDescription,
                seriesNumber: metadata.SeriesNumber,
                numberOfSeriesRelatedInstances:
                  metadata.NumberOfSeriesRelatedInstances,
              };
            });
            // if (this.seriesInfos.length > 0) {
            //   this.switchImage(this.seriesInfos[0]);
            // }
          });
      });
  }
  switchImage(event: CdkDragDrop<SeriesInfo[]>) {
    if (event.previousContainer === event.container) {
      return;
    } else {
      const seriesList = event.previousContainer.data;
      this.imageInfo = {
        wadoRsRoot: DICOM_SERVER,
        viewportType: ViewportType.ORTHOGRAPHIC,
        studyInstanceUID: seriesList[event.previousIndex].studyInstanceUID,
        seriesInstanceUID: seriesList[event.previousIndex].seriesInstanceUID,
        volumeId: seriesList[event.previousIndex].seriesInstanceUID,
      };
      console.log(this.imageInfo);
    }
  }
}
