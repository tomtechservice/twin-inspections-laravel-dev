import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { JobService } from '../../services/job/job.service';
import { environment } from '../../../../../environments/environment'
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
    @Input() job;
    @ViewChild('alertNotesModal') templateRef: TemplateRef<any>;
    private doSpace = environment.doSpace;
    private _modalRef: NgbModalRef;
    notes = {
        manager_note: '',
        is_manager_note_alert: 0
    };

    is_parent_notes = 0;
    parent_notes = [];

    addnotes = {
        add_notes: '',
        is_note_alert: 0
    }
    additional_notes = [];
    parent_additional_notes = [];
    alert_manager_notes = [];
    alert_additional_notes = [];
    is_loading: boolean;
    userData;
    permission: boolean;
    // front_office:boolean;

    constructor(public jobService: JobService, private modalService: NgbModal) { }

    ngOnInit() {
        this.notes.manager_note = this.job.manager_note
        this.notes.is_manager_note_alert = this.job.is_manager_note_alert
        this.additional_notes = this.job.parent_additional_notes
        this.userData = JSON.parse(localStorage.getItem('user'));

        // check if there are alert notes
        this.checkForAlertNotes();
    }

    managerNote() {
        this.jobService.managerNote(this.notes, this.job.job_id).subscribe(
            data => {
                Swal({
                    title: 'Success',
                    text: 'Note updated successfully'
                })
                this.notes.manager_note = data.data.manager_note
            }
        );
    }
    addNote() {
        this.is_loading = true;
        this.jobService.additionalNote(this.addnotes, this.job.job_id).subscribe(
            data => {
                Swal({
                    title: 'Success',
                    text: 'Added successfully'
                })
                this.is_loading = false;
                this.addnotes.add_notes = ''
                this.addnotes.is_note_alert = 0
                this.additional_notes = data.data
            }
        );
    }

    checkForAlertNotes() {
        if (this.notes.is_manager_note_alert) {
            this.alert_manager_notes[this.alert_manager_notes.length] = { 'notes': this.notes.manager_note };
        }
        // check for parent manager note
        // if (this.job.parent_manager_notes.length > 0) {
        //     for (let i = 0; i < this.job.parent_manager_notes.length; i++) {
        //         let parent_manage_note = this.job.parent_manager_notes[i];
        //         if (parent_manage_note == "") {
        //             continue;
        //         }
        //         this.alert_manager_notes[this.alert_manager_notes.length] = { 'notes': parent_manage_note };
        //         this.parent_notes[this.parent_notes.length] = {
        //             manager_note: parent_manage_note,
        //             is_manager_note_alert: 0
        //         };
        //     }

        //     this.is_parent_notes = 1;
        // }

        // check for additional notes
        if (this.additional_notes.length > 0) {
            for (let i = 0; i < this.additional_notes.length; i++) {
                if (this.additional_notes[i].is_note_alert) {
                    this.alert_additional_notes[this.alert_additional_notes.length] = this.additional_notes[i];
                }
            }
        }
        // check for parent additional notes
        // if (this.job.parent_additional_notes.length > 0) {
        //     for (let i = 0; i < this.job.parent_additional_notes.length; i++) {
        //         if (this.job.parent_additional_notes[i].is_note_alert) {
        //             this.alert_additional_notes[this.alert_additional_notes.length] = this.job.parent_additional_notes[i];
        //         }
        //         // add the parent note.
        //         this.parent_additional_notes[this.parent_additional_notes.length] = this.job.parent_additional_notes[i];
        //     }
        // }

        // check if notes are there to display
        if (this.alert_additional_notes.length > 0 || this.alert_manager_notes.length > 0) {
            this._modalRef = this.modalService.open(this.templateRef, { size: 'lg' });
        }
    }

    closeModal() {
        this._modalRef.close();
    }

    changeNoteAlertState(note_id, job_id) {
        // get status of note
        let status = jQuery('#note_' + note_id).prop('checked');
        this.is_loading = true;
        this.jobService.changeAdditionalNoteStatus({ 'status': status, 'note_id': note_id }, job_id).subscribe(
            data => {
                this.is_loading = false;

                // only child job.
                if (this.job.job_id == job_id) {
                    this.additional_notes = data.data;
                }
            }
        );
    }

}
