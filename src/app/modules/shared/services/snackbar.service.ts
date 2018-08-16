import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

export class SnackBarMessage  {
  message: string;
  action: string = null;
  config: MatSnackBarConfig = null;
}

@Injectable()
export class SnackBarService implements OnDestroy {

    [x: string]: any;
    private messageQueue: Subject<SnackBarMessage> = new Subject<SnackBarMessage>();
    private subscription: Subscription;
    private snackBarRef:  MatSnackBarRef<SimpleSnackBar>;
    isInstanceVisible = false;
    public msgQueue: Array<any> = [];


    constructor(public snackBar: MatSnackBar) {
        this.subscription = this.messageQueue.subscribe(message => {
            this.snackBarRef = this.snackBar.open(message.message, message.action, message.config);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    /**
     * Add a message
     * @param message The message to show in the snackbar.
     * @param action The label for the snackbar action.
     * @param config Additional configuration options for the snackbar.
     */
    add(message: string, action?: string, config?: MatSnackBarConfig): void {

        if ( !config ) {
            config = new MatSnackBarConfig();
            config.duration = 3000,
            config.panelClass = 'error-snackbar';
        }
        const sbMessage = new SnackBarMessage();
        const strErro = 'ERRO: ' + message;
        sbMessage.message = strErro;
        sbMessage.action = action;
        sbMessage.config = config;
        this.msgQueue.push(sbMessage);

        if (!this.isInstanceVisible) {
            this.showNext();
            this.messageQueue.next(sbMessage);
        }

    }

    showNext() {
        if (this.msgQueue.length === 0) {
          return;
        }
        const message = this.msgQueue.shift();
        this.isInstanceVisible = true;
        this.snackBarRef = this.snackBar.open(message.message, message.action, {duration: 2000});
        this.snackBarRef.afterDismissed().subscribe(() => {
          this.isInstanceVisible = false;
          this.showNext();
        });
    }
}
