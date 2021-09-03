import { Confirmation } from '../model/confirmation';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class ConfirmationService {

  private requireConfirmationSource = new Subject<Confirmation>();
    private acceptConfirmationSource = new Subject<Confirmation>();

    requireConfirmation$ = this.requireConfirmationSource.asObservable();
    accept = this.acceptConfirmationSource.asObservable();

    confirm(confirmation: Confirmation) {
        this.requireConfirmationSource.next(confirmation);
        return this;
    }

    close() {
        this.requireConfirmationSource.next(null);
        return this;
    }

    onAccept() {
        this.acceptConfirmationSource.next();
    }
}
