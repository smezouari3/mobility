import { RequestTransaction } from './../../model/requestTransaction';
import { TransactionService } from './../../service/transaction.service';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

// Menu
export interface Menu {
	headTitle1?: string,
	headTitle2?: string,
	path?: string;
	title?: string;
	icon?: string;
	type?: string;
	badgeType?: string;
	badgeValue?: string;
	active?: boolean;
	bookmark?: boolean;
	children?: Menu[];
}

@Injectable({
	providedIn: 'root'
})

export class NavService implements OnDestroy {

	private unsubscriber: Subject<any> = new Subject();
	public  screenWidth: BehaviorSubject<number> = new BehaviorSubject(window.innerWidth);

	// Search Box
	public search: boolean = false;

	// Language
	public language: boolean = false;

	// Mega Menu
	public megaMenu: boolean = false;
	public levelMenu: boolean = false;
	public megaMenuColapse: boolean = window.innerWidth < 1199 ? true : false;

	// For Horizontal Layout Mobile
	public horizontal: boolean = window.innerWidth < 991 ? false : true;

	// Collapse Sidebar
	public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

	// Full screen
	public fullScreen: boolean = false;

  transactionCount=0;

	constructor(private router: Router, private TransactionService:TransactionService) {
		this.setScreenWidth(window.innerWidth);
		fromEvent(window, 'resize').pipe(
			debounceTime(1000),
			takeUntil(this.unsubscriber)
		).subscribe((evt: any) => {
			this.setScreenWidth(evt.target.innerWidth);
			if (evt.target.innerWidth < 991) {
				this.collapseSidebar = true;
				this.megaMenu = false;
				this.levelMenu = false;
			}
			if(evt.target.innerWidth < 1199) {
				this.megaMenuColapse = true;
			}
		});
		if(window.innerWidth < 991) { // Detect Route change sidebar close
			this.router.events.subscribe(event => {
				this.collapseSidebar = true;
				this.megaMenu = false;
				this.levelMenu = false;
			});
		}
	}
/*   async ngOnInit() {
    let res:any=await this.TransactionService.getRequestTransactions().toPromise();
    let transactions:RequestTransaction[]=res;
    for(let transaction of transactions){
      if(transaction.statutTransaction=='En attent'){
        this.transactionCount++;
      }
    }
    console.log(transactions);
    console.log(this.transactionCount);

  } */

	ngOnDestroy() {
		this.unsubscriber.next();
		this.unsubscriber.complete();
	}

	private setScreenWidth(width: number): void {
		this.screenWidth.next(width);
	}

	MENUITEMS: Menu[] = [
		{
			headTitle1: 'General', headTitle2: 'Dashboard',
		},
		{
			title: 'Dashboard', icon: 'home', type: 'sub', badgeType: 'success', badgeValue: '2', active: true, children: [
				{ path: '/dashboard/default', title: 'Default', type: 'link' },
				{ path: '/dashboard/ecommerce', title: 'Ecommerce', type: 'link' }
			]
		},
		{
			headTitle1: 'Applications', headTitle2: 'Ready To Use Apps.',
		},
    { path: '/dashboard/user', title: 'Utilisateur', icon: 'users', type: 'link' },

    {
			title: 'Reservation', icon: 'map-pin', type: 'sub', active: false, children: [
        { path: '/dashboard/booking', title: 'Réservation', type: 'link' },
        { path: '/dashboard/booking-add', title: 'Ajouter', type: 'link' },

			]
		},

    { path: '/dashboard/city', title: 'Ville', icon:'map', type: 'link' },
    {
			path: '/dashboard/transaction', title: 'Transactions', icon: 'credit-card', type: 'link'
		},
    {
			headTitle1: 'Vehicules', headTitle2: 'Gérer les vehicules',
		},
		{
			title: 'Vehicule', icon: 'truck', type: 'sub', active: false, children: [
				{ path: '/dashboard/vehicle-category', title: 'Catégorie', type: 'link' },
				{ path: '/dashboard/vehicle-type', title: 'Type', type: 'link' },
				{ path: '/dashboard/vehicle', title: 'Vehicule', type: 'link' },
			]
		},
	];

	MEGAMENUITEMS: Menu[] = [
		{
			title: 'Error Pages', type: 'sub', active: true, children: [
				{ path: 'javascript:void(0);', title: 'Error Page 400', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Error Page 401', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Error Page 403', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Error Page 404', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Error Page 500', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Error Page 503', type: 'extLink' },
			]
		},
		{
			title: 'Authentication', type: 'sub', active: false, children: [
				{ path: 'javascript:void(0);', title: 'Login Simple', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Login BG Image', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Login BG Video', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Simple Register', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Register BG Image', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Register BG Video', type: 'extLink' }
			]
		},
		{
			title: 'Usefull Pages', type: 'sub', active: false, children: [
				{ path: 'javascript:void(0);', title: 'Search Pages', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Unlock User', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Forgot Password', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Reset Password', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Maintenance', type: 'extLink' }
			]
		},
		{
			title: 'Email templates', type: 'sub', active: false, children: [
				{ path: 'http://admin.pixelstrap.com/cuba/theme/basic-template.html', title: 'Basic Email', type: 'extTabLink' },
				{ path: 'http://admin.pixelstrap.com/cuba/theme/email-header.html', title: 'Basic With Header', type: 'extTabLink' },
				{ path: 'http://admin.pixelstrap.com/cuba/theme/template-email.html', title: 'Ecomerce Template', type: 'extTabLink' },
				{ path: 'http://admin.pixelstrap.com/cuba/theme/template-email-2.html', title: 'Email Template 2', type: 'extTabLink' },
				{ path: 'http://admin.pixelstrap.com/cuba/theme/ecommerce-templates.html', title: 'Ecommerce Email', type: 'extTabLink' },
				{ path: 'http://admin.pixelstrap.com/cuba/theme/email-order-success.html', title: 'Order Success', type: 'extTabLink' }
			]
		},
		{
			title: 'Coming Soon', type: 'sub', active: false, children: [
				{ path: 'javascript:void(0);', title: 'Coming Simple', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Coming BG Image', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Coming BG Video', type: 'extLink' }
			]
		},
	];

	LEVELMENUITEMS: Menu[] = [
		{
			path: 'javascript:void(0);', title: 'File Manager', icon: 'git-pull-request', type: 'extLink'
		},
		{
			title: 'Users', icon: 'users', type: 'sub', active: false, children: [
				{ path: 'javascript:void(0);', title: 'All Users', icon: 'users', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'User Profile', icon: 'users', type: 'extLink' },
				{ path: 'javascript:void(0);', title: 'Edit Profile', icon: 'users', type: 'extLink' },
			]
		},
		{ path: 'javascript:void(0);', title: 'Bookmarks', icon: 'heart', type: 'extLink' },
		{ path: 'javascript:void(0);', title: 'Calender', icon: 'calendar', type: 'extLink' },
		{ path: 'javascript:void(0);', title: 'Social App', icon: 'zap', type: 'extLink' }
	];

	// Array
	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
	megaItems = new BehaviorSubject<Menu[]>(this.MEGAMENUITEMS);
	levelmenuitems = new BehaviorSubject<Menu[]>(this.LEVELMENUITEMS);

}
