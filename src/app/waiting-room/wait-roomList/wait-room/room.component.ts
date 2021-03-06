/**
 * Created by jaehong on 2017. 11. 29..
 */
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Room } from '../../../../../models/room';
import { GameIoService } from '../../../service/game-io.service';
import { HttpClient } from '@angular/common/http';
import {SessionService} from '../../../service/session.service';

@Component({
    selector : 'app-wait-room',
    template: `
    <mat-card (click)="enterPassword()" style="width:256px;">
        <mat-card-header style="height: 70px;">
            {{room.name}}
        </mat-card-header>
        <mat-card-content>
            <img mat-card-image src="../../../../assets/{{room.type}}.png" alt="Photo of a Shiba Inu">
            <p align="right">{{room.users.length}}/{{room.maxUser}}</p>
        </mat-card-content>
    </mat-card>`
})

export class WaitRoomComponent implements OnInit {
    @Input() room: Room;

    constructor(private http: HttpClient,
                public dialog: MatDialog,
                private gameIo: GameIoService,
                private sessionService: SessionService) {}

    ngOnInit(): void {
    }

    enterPassword(): void {
        (this.room.password == '' ? this.correctPassword() : this.openDialog());
    }

    openDialog(): void {
        let dialogRef = this.dialog.open(InputPassword, {
            width: '250px'
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('result', result);
            if(result) {
                (result == this.room.password ? this.correctPassword() : alert('nono'));
            }
        });


    }

    correctPassword(): void {
        // joinRoom using REST if ok run below
        this.http.post('/room/' + this.room['name'], {
            data: this.sessionService.getSessionId()
        }).subscribe(data => {
            if (data['result']) {
                this.gameIo.setRoomId(this.room['name']);
                this.sessionService.setCurrentPage('game');
            } else {
                alert('사람 꽉찼어. 다른방 찾아봐!');
            }
        });
    }
}

@Component({
    selector: 'input-password',
    template: `
    <h1 mat-dialog-title>Enter a Password</h1>
    <div mat-dialog-content>
        <mat-form-field>
            <input matInput [(ngModel)]="password">
        </mat-form-field>
    </div>
    <div mat-dialog-actions>
        <button mat-button [mat-dialog-close]="password" tabindex="2">Enter</button>
        <button mat-button (click)="onNoClick()" tabindex="-1">Cancel</button>
    </div>`
})
export class InputPassword {
    password: string;

    constructor(public dialogRef: MatDialogRef<InputPassword>) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
}



