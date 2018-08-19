import { FormGroup } from '@angular/forms';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';

export class InFormErrorHandler {
    private key: string = null;
    private subject = new BehaviorSubject<string>(this.key);
    private formValueChangeSubscription: Subscription;

    constructor(
        private form: FormGroup
    ) {}

    private hideFormError() {
        this.key = null;
        this.formValueChangeSubscription.unsubscribe();
    }

    showFormError(errorMsgKey: string) {
        this.key = errorMsgKey;
        this.formValueChangeSubscription = this.form.valueChanges.subscribe(() => this.hideFormError());
    }

    getErrorKeyObservable(): Observable<string> {
        return this.subject;
    }
}
