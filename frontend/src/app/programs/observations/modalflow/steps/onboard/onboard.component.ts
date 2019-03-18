import {
  Component,
  ViewEncapsulation,
  Input,
  ViewChild,
  ElementRef,
  OnInit
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

import { IFlowComponent } from "../../flow/flow";
import { RegisterComponent } from "../../../../../auth/register/register.component";
import { LoginComponent } from "../../../../../auth/login/login.component";
import { AuthService } from "../../../../../auth/auth.service";

@Component({
  templateUrl: "./onboard.component.html",
  styleUrls: ["./onboard.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class OnboardComponent implements IFlowComponent, OnInit {
  RegistrationModalRef: NgbModalRef;
  LoginModalRef: NgbModalRef;
  timeout: any;
  @Input("data") data: any;
  @ViewChild("RegisterComponent") RegisterComponent: ElementRef;
  @ViewChild("LoginComponent") LoginComponent: ElementRef;

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.authService.authorized$.subscribe(value => {
      if (value) {
        this.timeout = setTimeout(() => this.data.next(), 0);
      }
    });
  }

  // Actions
  register() {
    console.debug("register action > data:", this.data);
    this.RegistrationModalRef = this.modalService.open(RegisterComponent, {
      centered: true
    });
    this.RegistrationModalRef.result.then(_ => {
      console.debug("[obs-flow] registration resolved");
      this.authService.isLoggedIn().subscribe(
        value => {
          if (value) {
          }
        },
        reason => {
          console.debug("registration dismissed:", reason);
        }
      );
    });
  }

  login() {
    // if not logged_in then stack Login modal dialog
    console.debug("login action > data:", this.data);
    // this.authService.redirectUrl = this.route.snapshot.url[0].path;
    this.LoginModalRef = this.modalService.open(LoginComponent, {
      centered: true
    });
    this.LoginModalRef.result.then(_ => {
      console.debug("[obs-flow] login resolved");
      this.authService.isLoggedIn().subscribe(
        value => {
          if (value) {
            // assert login
          }
        },
        reason => {
          console.debug("login dismissed:", reason);
        }
      );
    });
  }

  continue() {
    console.debug("continue");
    // Continue to Submission form as Anonymous|Registered user
    // authenticated but not logged in ... deserves notification ?
    this.data.next();
  }
}
