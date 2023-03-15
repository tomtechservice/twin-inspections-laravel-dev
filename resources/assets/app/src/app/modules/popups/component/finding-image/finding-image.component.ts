import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { environment } from '../../../../../environments/environment';
import { FindingService } from '../../../intake/services/finding/finding.service'
import Swal from 'sweetalert2';
import { LockoutComponent } from '../../../lockout/components/lockout/lockout.component';

@Component({
    selector: 'app-finding-image',
    templateUrl: './finding-image.component.html',
    styleUrls: ['./finding-image.component.scss']
})
export class FindingImageComponent implements OnInit {
    private apiURL = environment.api;
    imageValidations = false;
    isUpdated = false;
    showLoader = false;
    public uploader: FileUploader

    existingFindingImages: string[]

    @Input() findingId;
    @Input() lockoutSetting;
    @Input() inspection_report_is_sent;

    @ViewChild('selectedFile') selectedFile: any;

    constructor(public activeModal: NgbActiveModal, private findingService: FindingService, private modelService: NgbModal) {
        let app_token = localStorage.getItem('app_token');
        this.uploader = new FileUploader({
            url: this.apiURL + 'saveFindingImage',
            itemAlias: 'photo',
            authToken: `Bearer ${app_token}`,
        });
    }

    public imagePath = this.findingService.imagePath;

    ngOnInit() {
        this.getFindingImages();
        this.fileUploadOperations()
    }

    fileUploadOperations() {
        this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
            form.append('findingId', this.findingId);
        };
        this.uploader.onProgressAll = (progress: any) => {
            this.showLoader = true;
        }
        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false;
        };
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            let result = JSON.parse(response);

            if (result.status == 400) {
                this.showLoader = false;
                this.imageValidations = true;
                this.clearSelectedFile()
            } else {
                this.showLoader = false;
                this.imageValidations = false;
                this.activeModal.close({ case: 'upload_finding_image' })
            }

        };
    }

    uploadFindingImages() {
        let openpopup = this.openFindingLockoutPopup();
        openpopup.then((value) => {
            if (value) {
                this.uploader.uploadAll();
            }
            else {
                this.clearSelectedFile();
                this.activeModal.close();
            }
        });
    }

    getFindingImages() {
        this.findingService.getFindingImage(this.findingId).subscribe(
            data => {
                this.existingFindingImages = data.result.data;
            }
        )
    }

    removeImage(finding_image_id) {
        Swal({
            title: 'Are you sure?',
            text: 'Remove Finding Image!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, remove it!',
            cancelButtonText: 'No, keep it'
        }).then((result) => {
            if (result.value) {
                this.findingService.deleteFindingImage(finding_image_id).subscribe(
                    data => {
                        this.isUpdated = true;
                        this.getFindingImages();
                        Swal(
                            'Removed!',
                            'Finding Image has been removed.',
                            'success'
                        )
                    }
                );

            } else if (result.dismiss === Swal.DismissReason.cancel) {

            }
        })
    }

    closeClick() {
        if (this.isUpdated) {
            this.activeModal.close({ case: 'remove_finding_image' })
        } else {
            this.activeModal.close('Close click')
        }
    }

    clearSelectedFile() {
        this.uploader.queue[0].remove()
        this.selectedFile.nativeElement.value = '';
    }

    // open popup modal for lockout pin
    openFindingLockoutPopup() {
        return new Promise((resolve) => {
            if (this.inspection_report_is_sent && this.lockoutSetting && this.lockoutSetting.finding_lockout_pin !== "") {
                const modalRef = this.modelService.open(LockoutComponent);
                modalRef.componentInstance.lockout_type = "findings";
                modalRef.componentInstance.lockoutSetting = this.lockoutSetting;
                modalRef.result.then((result) => {
                    resolve(result);
                }).catch((error) => {
                    resolve(false);
                });
            }
            else {
                resolve(true);
            }
        });
    }

}
